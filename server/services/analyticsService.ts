import { storage } from "../storage";
import { logger } from "../utils/logger";

interface DashboardMetrics {
  totalHashRate: number;
  hashRateChange: number;
  treeEfficiency: number;
  efficiencyChange: number;
  activeGPUs: string;
  dailyRevenue: number;
  revenueChange: number;
  systemHealth: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  networkLoad: number;
  transactionsProcessed: number;
  transactionsPending: number;
}

interface ChartDataPoint {
  timestamp: string;
  hashRate: number;
  efficiency: number;
  temperature: number;
  power: number;
}

interface PerformanceAnalytics {
  averageHashRate: number;
  peakHashRate: number;
  averageEfficiency: number;
  uptimePercentage: number;
  totalTransactions: number;
  averageProcessingTime: number;
  errorRate: number;
}

class AnalyticsService {
  private isInitialized = false;
  private previousMetrics: any = {};

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Analytics Service...');

    try {
      // Load previous metrics for comparison
      const latestMetrics = await storage.getLatestSystemMetrics();
      if (latestMetrics) {
        this.previousMetrics = latestMetrics;
      }

      this.isInitialized = true;
      logger.info('Analytics Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Analytics Service:', error);
      throw error;
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const currentMetrics = await storage.getLatestSystemMetrics();
      const gpus = await storage.getGPUs();
      
      if (!currentMetrics) {
        throw new Error('No metrics available');
      }

      const activeGPUs = gpus.filter(gpu => gpu.status === 'online');
      const totalGPUs = gpus.length;

      // Calculate percentage changes
      const hashRateChange = this.calculatePercentageChange(
        currentMetrics.totalHashRate,
        this.previousMetrics.totalHashRate || currentMetrics.totalHashRate
      );

      const efficiencyChange = this.calculatePercentageChange(
        currentMetrics.treeEfficiency,
        this.previousMetrics.treeEfficiency || currentMetrics.treeEfficiency
      );

      const revenueChange = this.calculatePercentageChange(
        currentMetrics.dailyRevenue,
        this.previousMetrics.dailyRevenue || currentMetrics.dailyRevenue
      );

      // System health assessment
      const systemHealth = this.assessSystemHealth(currentMetrics, gpus);

      return {
        totalHashRate: Math.round(currentMetrics.totalHashRate * 10) / 10,
        hashRateChange,
        treeEfficiency: Math.round(currentMetrics.treeEfficiency * 10) / 10,
        efficiencyChange,
        activeGPUs: `${activeGPUs.length}/${totalGPUs}`,
        dailyRevenue: Math.round(currentMetrics.dailyRevenue * 100) / 100,
        revenueChange,
        systemHealth,
        cpuUsage: Math.round(currentMetrics.cpuUsage * 10) / 10,
        memoryUsage: Math.round(currentMetrics.memoryUsage * 10) / 10,
        storageUsage: Math.round(currentMetrics.storageUsage * 10) / 10,
        networkLoad: Math.round(currentMetrics.networkLoad * 10) / 10,
        transactionsProcessed: currentMetrics.transactionsProcessed,
        transactionsPending: currentMetrics.transactionsPending,
      };
    } catch (error) {
      logger.error('Error getting dashboard metrics:', error);
      throw error;
    }
  }

  async getChartData(hours: number): Promise<ChartDataPoint[]> {
    try {
      const metrics = await storage.getSystemMetricsHistory(hours);
      const gpus = await storage.getGPUs();

      return metrics.map(metric => {
        // Calculate average GPU temperature and power
        const avgTemperature = gpus.length > 0 
          ? gpus.reduce((sum, gpu) => sum + gpu.temperature, 0) / gpus.length
          : 65;
        
        const avgPower = gpus.length > 0
          ? gpus.reduce((sum, gpu) => sum + gpu.power, 0) / gpus.length
          : 300;

        return {
          timestamp: metric.timestamp?.toISOString() || new Date().toISOString(),
          hashRate: Math.round(metric.totalHashRate * 10) / 10,
          efficiency: Math.round(metric.treeEfficiency * 10) / 10,
          temperature: Math.round(avgTemperature),
          power: Math.round(avgPower),
        };
      });
    } catch (error) {
      logger.error('Error getting chart data:', error);
      throw error;
    }
  }

  async getPerformanceAnalytics(hours: number): Promise<PerformanceAnalytics> {
    try {
      const metrics = await storage.getSystemMetricsHistory(hours);
      const transactionStats = await storage.getTransactionStats(hours);
      const gpus = await storage.getGPUs();

      if (metrics.length === 0) {
        throw new Error('No metrics available for the specified period');
      }

      // Calculate averages and peaks
      const hashRates = metrics.map(m => m.totalHashRate);
      const efficiencies = metrics.map(m => m.treeEfficiency);
      
      const averageHashRate = hashRates.reduce((sum, rate) => sum + rate, 0) / hashRates.length;
      const peakHashRate = Math.max(...hashRates);
      const averageEfficiency = efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length;

      // Calculate uptime percentage based on GPU status
      const onlineGPUs = gpus.filter(gpu => gpu.status === 'online').length;
      const uptimePercentage = gpus.length > 0 ? (onlineGPUs / gpus.length) * 100 : 0;

      // Error rate calculation (based on GPU errors and system issues)
      const errorGPUs = gpus.filter(gpu => gpu.status === 'error').length;
      const errorRate = gpus.length > 0 ? (errorGPUs / gpus.length) * 100 : 0;

      return {
        averageHashRate: Math.round(averageHashRate * 10) / 10,
        peakHashRate: Math.round(peakHashRate * 10) / 10,
        averageEfficiency: Math.round(averageEfficiency * 10) / 10,
        uptimePercentage: Math.round(uptimePercentage * 10) / 10,
        totalTransactions: transactionStats.totalProcessed,
        averageProcessingTime: Math.round(transactionStats.averageProcessingTime * 1000) / 1000,
        errorRate: Math.round(errorRate * 10) / 10,
      };
    } catch (error) {
      logger.error('Error getting performance analytics:', error);
      throw error;
    }
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  private assessSystemHealth(metrics: any, gpus: any[]): string {
    let healthScore = 100;

    // GPU health impact
    const errorGPUs = gpus.filter(gpu => gpu.status === 'error').length;
    const warningGPUs = gpus.filter(gpu => gpu.status === 'warning').length;
    const offlineGPUs = gpus.filter(gpu => gpu.status === 'offline').length;

    healthScore -= errorGPUs * 15;
    healthScore -= warningGPUs * 8;
    healthScore -= offlineGPUs * 10;

    // System resource impact
    if (metrics.cpuUsage > 90) healthScore -= 15;
    else if (metrics.cpuUsage > 80) healthScore -= 8;

    if (metrics.memoryUsage > 95) healthScore -= 15;
    else if (metrics.memoryUsage > 85) healthScore -= 8;

    if (metrics.treeEfficiency < 80) healthScore -= 20;
    else if (metrics.treeEfficiency < 90) healthScore -= 10;

    // Determine health status
    if (healthScore >= 95) return 'Excellent';
    if (healthScore >= 85) return 'Good';
    if (healthScore >= 70) return 'Fair';
    if (healthScore >= 50) return 'Poor';
    return 'Critical';
  }

  async generateReport(type: 'daily' | 'weekly' | 'monthly'): Promise<any> {
    const hours = type === 'daily' ? 24 : type === 'weekly' ? 168 : 720;
    
    try {
      const [metrics, performance, transactionStats] = await Promise.all([
        this.getDashboardMetrics(),
        this.getPerformanceAnalytics(hours),
        storage.getTransactionStats(hours),
      ]);

      const report = {
        type,
        generatedAt: new Date().toISOString(),
        period: `Last ${hours} hours`,
        summary: {
          ...metrics,
          ...performance,
          ...transactionStats,
        },
        recommendations: this.generateRecommendations(metrics, performance),
      };

      logger.info(`Generated ${type} report`);
      return report;
    } catch (error) {
      logger.error('Error generating report:', error);
      throw error;
    }
  }

  private generateRecommendations(metrics: any, performance: any): string[] {
    const recommendations: string[] = [];

    if (performance.averageEfficiency < 90) {
      recommendations.push('Consider optimizing Merkle tree configuration to improve efficiency');
    }

    if (performance.errorRate > 5) {
      recommendations.push('High error rate detected - check GPU temperatures and power settings');
    }

    if (performance.uptimePercentage < 95) {
      recommendations.push('Uptime is below optimal - investigate GPU stability issues');
    }

    if (metrics.systemHealth !== 'Excellent' && metrics.systemHealth !== 'Good') {
      recommendations.push('System health requires attention - review alerts and system resources');
    }

    if (performance.averageProcessingTime > 0.1) {
      recommendations.push('Transaction processing time can be improved with parallel optimization');
    }

    if (recommendations.length === 0) {
      recommendations.push('System is performing optimally - maintain current configuration');
    }

    return recommendations;
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasPreviousMetrics: Object.keys(this.previousMetrics).length > 0,
    };
  }
}

export const analyticsService = new AnalyticsService();
