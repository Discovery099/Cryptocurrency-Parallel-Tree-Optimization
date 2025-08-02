import { storage } from "../storage";
import { logger } from "../utils/logger";
import type { InsertAlert } from "@shared/schema";

interface AlertStats {
  total: number;
  unread: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
}

class AlertService {
  private isInitialized = false;
  private broadcast?: (event: string, data: any) => void;
  private alertQueue: InsertAlert[] = [];
  private processingInterval?: NodeJS.Timeout;
  private recentAlerts: Set<string> = new Set(); // Prevent duplicate alerts
  private alertThrottles: Map<string, Date> = new Map(); // Throttle similar alerts

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Alert Service...');

    try {
      // Start alert processing queue
      this.startAlertProcessing();
      
      // Clean up old throttles periodically
      this.startThrottleCleanup();
      
      this.isInitialized = true;
      logger.info('Alert Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Alert Service:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private startAlertProcessing(): void {
    this.processingInterval = setInterval(async () => {
      await this.processAlertQueue();
    }, 1000); // Process alerts every second
  }

  private startThrottleCleanup(): void {
    setInterval(() => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      // Clean up throttles older than 5 minutes
      for (const [key, timestamp] of this.alertThrottles.entries()) {
        if (timestamp < fiveMinutesAgo) {
          this.alertThrottles.delete(key);
        }
      }
      
      // Clean up recent alerts older than 1 minute
      this.recentAlerts.clear();
    }, 60000); // Clean up every minute
  }

  private async processAlertQueue(): Promise<void> {
    if (this.alertQueue.length === 0) return;

    const alertsToProcess = this.alertQueue.splice(0, 10); // Process up to 10 alerts at once
    
    for (const alertData of alertsToProcess) {
      try {
        const alert = await storage.createAlert(alertData);
        
        // Broadcast to connected clients
        if (this.broadcast) {
          this.broadcast('new_alert', alert);
        }
        
        logger.info(`Alert created: ${alert.title} [${alert.severity}]`);
      } catch (error) {
        logger.error('Error processing alert:', error);
      }
    }
  }

  async createAlert(alertData: InsertAlert): Promise<void> {
    // Generate unique key for throttling
    const throttleKey = `${alertData.title}_${alertData.source}_${alertData.sourceId || 'global'}`;
    
    // Check if this alert should be throttled
    if (this.shouldThrottleAlert(throttleKey, alertData.severity)) {
      return;
    }

    // Add to processing queue
    this.alertQueue.push(alertData);
    
    // Update throttle timestamp
    this.alertThrottles.set(throttleKey, new Date());
    
    // Add to recent alerts set for immediate duplicate prevention
    this.recentAlerts.add(throttleKey);
  }

  private shouldThrottleAlert(throttleKey: string, severity: string): boolean {
    const now = new Date();
    const lastAlert = this.alertThrottles.get(throttleKey);
    
    if (!lastAlert) return false;
    
    // Throttle timeouts based on severity
    const throttleMinutes = this.getThrottleTimeout(severity);
    const throttleTime = new Date(lastAlert.getTime() + throttleMinutes * 60 * 1000);
    
    return now < throttleTime;
  }

  private getThrottleTimeout(severity: string): number {
    switch (severity) {
      case 'critical': return 1; // 1 minute for critical alerts
      case 'high': return 3;     // 3 minutes for high alerts
      case 'medium': return 5;   // 5 minutes for medium alerts
      case 'low': return 10;     // 10 minutes for low alerts
      default: return 5;
    }
  }

  async getAlertStats(): Promise<AlertStats> {
    try {
      const alerts = await storage.getAlerts(1000); // Get recent alerts for stats
      
      const stats: AlertStats = {
        total: alerts.length,
        unread: alerts.filter(a => !a.isRead).length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length,
        byType: {},
        bySource: {},
      };

      // Count by type
      for (const alert of alerts) {
        stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1;
        if (alert.source) {
          stats.bySource[alert.source] = (stats.bySource[alert.source] || 0) + 1;
        }
      }

      return stats;
    } catch (error) {
      logger.error('Error getting alert stats:', error);
      throw error;
    }
  }

  async createSystemAlert(title: string, message: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): Promise<void> {
    await this.createAlert({
      type: 'info',
      title,
      message,
      source: 'system',
      severity,
    });
  }

  async createGPUAlert(gpuId: string, title: string, message: string, type: 'warning' | 'error' = 'warning'): Promise<void> {
    await this.createAlert({
      type,
      title,
      message,
      source: 'gpu',
      sourceId: gpuId,
      severity: type === 'error' ? 'high' : 'medium',
    });
  }

  async createPoolAlert(poolId: string, title: string, message: string, severity: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    await this.createAlert({
      type: 'warning',
      title,
      message,
      source: 'pool',
      sourceId: poolId,
      severity,
    });
  }

  async createPerformanceAlert(metric: string, value: number, threshold: number): Promise<void> {
    const severity = value > threshold * 1.5 ? 'high' : value > threshold * 1.2 ? 'medium' : 'low';
    
    await this.createAlert({
      type: 'warning',
      title: `Performance Alert: ${metric}`,
      message: `${metric} is ${value.toFixed(2)} (threshold: ${threshold.toFixed(2)})`,
      source: 'system',
      severity,
    });
  }

  async resolveAlertsBySource(source: string, sourceId?: string): Promise<void> {
    try {
      const alerts = await storage.getAlerts();
      const alertsToResolve = alerts.filter(alert => 
        alert.source === source && 
        (!sourceId || alert.sourceId === sourceId) &&
        !alert.isResolved
      );

      for (const alert of alertsToResolve) {
        await storage.markAlertAsResolved(alert.id);
      }

      if (this.broadcast && alertsToResolve.length > 0) {
        this.broadcast('alerts_resolved', { source, sourceId, count: alertsToResolve.length });
      }

      logger.info(`Resolved ${alertsToResolve.length} alerts for ${source}${sourceId ? `:${sourceId}` : ''}`);
    } catch (error) {
      logger.error('Error resolving alerts by source:', error);
    }
  }

  async autoResolveOldAlerts(): Promise<void> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const alerts = await storage.getAlerts(1000);
      
      const oldAlerts = alerts.filter(alert => 
        !alert.isResolved &&
        alert.severity === 'low' &&
        alert.createdAt &&
        alert.createdAt < twentyFourHoursAgo
      );

      for (const alert of oldAlerts) {
        await storage.markAlertAsResolved(alert.id);
      }

      if (oldAlerts.length > 0) {
        logger.info(`Auto-resolved ${oldAlerts.length} old low-severity alerts`);
      }
    } catch (error) {
      logger.error('Error auto-resolving old alerts:', error);
    }
  }

  // Predefined alert templates for common scenarios
  async createTemperatureAlert(gpuId: string, gpuName: string, temperature: number): Promise<void> {
    if (temperature > 90) {
      await this.createGPUAlert(
        gpuId,
        'Critical GPU Temperature',
        `${gpuName} is critically overheating at ${temperature}°C - immediate action required`,
        'error'
      );
    } else if (temperature > 85) {
      await this.createGPUAlert(
        gpuId,
        'High GPU Temperature',
        `${gpuName} is running hot at ${temperature}°C`,
        'warning'
      );
    }
  }

  async createHashRateAlert(hashRate: number, threshold: number): Promise<void> {
    const percentageDrop = ((threshold - hashRate) / threshold) * 100;
    
    await this.createAlert({
      type: 'warning',
      title: 'Hash Rate Drop Detected',
      message: `Hash rate dropped to ${hashRate.toFixed(1)} TH/s (${percentageDrop.toFixed(1)}% below threshold)`,
      source: 'system',
      severity: percentageDrop > 20 ? 'high' : percentageDrop > 10 ? 'medium' : 'low',
    });
  }

  async createEfficiencyAlert(efficiency: number): Promise<void> {
    if (efficiency < 80) {
      await this.createAlert({
        type: 'warning',
        title: 'Low Mining Efficiency',
        message: `Mining efficiency dropped to ${efficiency.toFixed(1)}% - optimization recommended`,
        source: 'system',
        severity: 'medium',
      });
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      queueSize: this.alertQueue.length,
      activeThrottles: this.alertThrottles.size,
      recentAlertsCount: this.recentAlerts.size,
    };
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Alert Service...');
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    // Process remaining alerts
    await this.processAlertQueue();
    
    this.alertQueue = [];
    this.recentAlerts.clear();
    this.alertThrottles.clear();
    
    logger.info('Alert Service shut down successfully');
  }
}

export const alertService = new AlertService();
