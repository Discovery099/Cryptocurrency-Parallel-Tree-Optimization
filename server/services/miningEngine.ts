import { storage } from "../storage";
import { merkleTreeService } from "./merkleTreeService";
import { gpuManager } from "./gpuManager";
import { alertService } from "./alertService";
import { logger } from "../utils/logger";
import { MINING_CONSTANTS } from "../utils/constants";

interface MiningEngineStatus {
  isRunning: boolean;
  hashRate: number;
  efficiency: number;
  activeAlgorithm: string;
  parallelThreads: number;
  uptime: number;
}

class MiningEngine {
  private isInitialized = false;
  private isRunning = false;
  private startTime = Date.now();
  private currentHashRate = 0;
  private currentEfficiency = 0;
  private broadcast?: (event: string, data: any) => void;
  private metricsInterval?: NodeJS.Timeout;
  private processingInterval?: NodeJS.Timeout;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Mining Engine...');

    try {
      // Initialize merkle tree service
      await merkleTreeService.initialize();
      
      // Start metrics collection
      this.startMetricsCollection();
      
      // Start transaction processing simulation
      this.startTransactionProcessing();
      
      this.isRunning = true;
      this.isInitialized = true;
      
      logger.info('Mining Engine initialized successfully');
      
      await alertService.createAlert({
        type: 'info',
        title: 'Mining Engine Started',
        message: 'Adaptive parallel Merkle tree mining engine is now operational',
        source: 'system',
        severity: 'low',
      });
    } catch (error) {
      logger.error('Failed to initialize Mining Engine:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(async () => {
      try {
        await this.collectAndStoreMetrics();
      } catch (error) {
        logger.error('Error collecting metrics:', error);
      }
    }, MINING_CONSTANTS.METRICS_INTERVAL);
  }

  private startTransactionProcessing(): void {
    this.processingInterval = setInterval(async () => {
      try {
        await this.processTransactionBatch();
      } catch (error) {
        logger.error('Error processing transaction batch:', error);
      }
    }, MINING_CONSTANTS.PROCESSING_INTERVAL);
  }

  private async collectAndStoreMetrics(): Promise<void> {
    const gpus = await storage.getGPUs();
    const activeGPUs = gpus.filter(gpu => gpu.status === 'online');
    
    // Calculate aggregated metrics
    this.currentHashRate = activeGPUs.reduce((sum, gpu) => sum + gpu.hashRate, 0);
    
    // Simulate efficiency based on various factors
    const tempEfficiency = this.calculateTemperatureEfficiency(activeGPUs);
    const loadEfficiency = this.calculateLoadEfficiency();
    const configEfficiency = await this.calculateConfigurationEfficiency();
    
    this.currentEfficiency = (tempEfficiency + loadEfficiency + configEfficiency) / 3;

    // Generate revenue calculation (simplified)
    const dailyRevenue = this.currentHashRate * MINING_CONSTANTS.REVENUE_PER_TH * 24;

    // System resource usage simulation
    const cpuUsage = Math.random() * 30 + 20; // 20-50%
    const memoryUsage = Math.random() * 20 + 60; // 60-80%
    const storageUsage = Math.random() * 10 + 40; // 40-50%
    const networkLoad = Math.random() * 30 + 60; // 60-90%

    // Transaction processing metrics
    const baseTransactions = MINING_CONSTANTS.BASE_TRANSACTIONS_PER_SECOND;
    const efficiencyMultiplier = this.currentEfficiency / 100;
    const transactionsProcessed = Math.floor(baseTransactions * efficiencyMultiplier * activeGPUs.length);
    const transactionsPending = Math.floor(Math.random() * 5000 + 2000);

    const metrics = {
      totalHashRate: this.currentHashRate,
      treeEfficiency: this.currentEfficiency,
      activeGPUs: activeGPUs.length,
      dailyRevenue,
      cpuUsage,
      memoryUsage,
      storageUsage,
      networkLoad,
      transactionsProcessed,
      transactionsPending,
    };

    await storage.createSystemMetric(metrics);

    // Broadcast real-time updates
    if (this.broadcast) {
      this.broadcast('metrics_update', metrics);
    }

    // Check for performance alerts
    await this.checkPerformanceAlerts(metrics);
  }

  private calculateTemperatureEfficiency(gpus: any[]): number {
    if (gpus.length === 0) return 0;
    
    const avgTemp = gpus.reduce((sum, gpu) => sum + gpu.temperature, 0) / gpus.length;
    const optimalTemp = 65;
    const maxTemp = 85;
    
    if (avgTemp <= optimalTemp) return 100;
    if (avgTemp >= maxTemp) return 60;
    
    return 100 - ((avgTemp - optimalTemp) / (maxTemp - optimalTemp)) * 40;
  }

  private calculateLoadEfficiency(): number {
    // Simulate load-based efficiency
    const currentLoad = Math.random() * 100;
    const optimalLoad = 85;
    
    if (currentLoad <= optimalLoad) {
      return 95 + (currentLoad / optimalLoad) * 5;
    } else {
      return 100 - ((currentLoad - optimalLoad) / (100 - optimalLoad)) * 15;
    }
  }

  private async calculateConfigurationEfficiency(): Promise<number> {
    const config = await storage.getActiveMerkleTreeConfig();
    if (!config) return 85;

    // Simulate configuration-based efficiency improvements
    let efficiency = 85;
    
    // Parallel threads optimization
    const optimalThreads = 512;
    if (config.parallelThreads === optimalThreads) {
      efficiency += 5;
    } else if (Math.abs(config.parallelThreads - optimalThreads) <= 128) {
      efficiency += 3;
    }
    
    // Cache strategy bonus
    if (config.cacheStrategy === 'adaptive') {
      efficiency += 7;
    } else if (config.cacheStrategy === 'lru') {
      efficiency += 3;
    }
    
    // Tree depth optimization
    if (config.treeDepth === 'auto') {
      efficiency += 3;
    }
    
    return Math.min(efficiency, 100);
  }

  private async processTransactionBatch(): Promise<void> {
    const config = await storage.getActiveMerkleTreeConfig();
    const gpus = await storage.getGPUs();
    const activeGPUs = gpus.filter(gpu => gpu.status === 'online');
    
    if (activeGPUs.length === 0) return;

    // Simulate adaptive parallel merkle tree construction
    const batchSize = Math.floor(Math.random() * 10000) + 5000; // 5k-15k transactions
    const algorithm = config?.cacheStrategy === 'adaptive' ? 'PhaseNU-Adaptive' : 'PhaseNU-Standard';
    
    // Simulate processing time based on batch size and efficiency
    const baseProcessingTime = batchSize / MINING_CONSTANTS.BASE_TRANSACTIONS_PER_SECOND;
    const efficiencyMultiplier = this.currentEfficiency / 100;
    const processingTime = baseProcessingTime / efficiencyMultiplier;
    
    // Generate merkle root (simulated)
    const merkleRoot = this.generateMerkleRoot(batchSize);
    
    // Determine network type based on batch characteristics
    const networkType = batchSize > 8000 ? 'bitcoin' : 'ethereum';
    
    const batch = {
      batchSize,
      processingTime,
      merkleRoot,
      algorithm,
      networkType,
      efficiency: this.currentEfficiency,
      gpuIds: activeGPUs.slice(0, Math.ceil(activeGPUs.length * 0.7)).map(gpu => gpu.id), // Use 70% of GPUs
    };

    try {
      await storage.createTransactionBatch(batch);
    } catch (error) {
      // Transaction batch creation failed - log for debugging but don't crash
      logger.error('Failed to store transaction batch:', error);
      return;
    }

    // Broadcast processing update
    if (this.broadcast) {
      this.broadcast('batch_processed', batch);
    }
  }

  private generateMerkleRoot(batchSize: number): string {
    // Simulate merkle root generation
    const hash = require('crypto').createHash('sha256');
    hash.update(`batch-${batchSize}-${Date.now()}`);
    return hash.digest('hex');
  }

  private async checkPerformanceAlerts(metrics: any): Promise<void> {
    // High temperature alert
    const gpus = await storage.getGPUs();
    const hotGPUs = gpus.filter(gpu => gpu.temperature > 80);
    
    for (const gpu of hotGPUs) {
      if (gpu.temperature > 85) {
        await alertService.createAlert({
          type: 'error',
          title: 'Critical GPU Temperature',
          message: `${gpu.name} is running at ${gpu.temperature}°C - immediate attention required`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'critical',
        });
      } else {
        await alertService.createAlert({
          type: 'warning',
          title: 'GPU Temperature Warning',
          message: `${gpu.name} is running at ${gpu.temperature}°C`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'medium',
        });
      }
    }

    // Low efficiency alert
    if (metrics.treeEfficiency < 85) {
      await alertService.createAlert({
        type: 'warning',
        title: 'Low Mining Efficiency',
        message: `Current efficiency is ${metrics.treeEfficiency.toFixed(1)}% - consider optimization`,
        source: 'system',
        severity: 'medium',
      });
    }

    // High system load alert
    if (metrics.cpuUsage > 90 || metrics.memoryUsage > 95) {
      await alertService.createAlert({
        type: 'warning',
        title: 'High System Load',
        message: `CPU: ${metrics.cpuUsage.toFixed(1)}%, Memory: ${metrics.memoryUsage.toFixed(1)}%`,
        source: 'system',
        severity: 'high',
      });
    }
  }

  async optimizePerformance(): Promise<void> {
    logger.info('Starting performance optimization...');
    
    try {
      // Optimize merkle tree configuration
      await merkleTreeService.optimizeConfiguration();
      
      // Optimize GPU settings
      await gpuManager.optimizeAll();
      
      // Update metrics
      await this.collectAndStoreMetrics();
      
      await alertService.createAlert({
        type: 'success',
        title: 'Performance Optimization Complete',
        message: 'System has been optimized for maximum efficiency',
        source: 'system',
        severity: 'low',
      });
      
      logger.info('Performance optimization completed successfully');
    } catch (error) {
      logger.error('Performance optimization failed:', error);
      throw error;
    }
  }

  getStatus(): MiningEngineStatus {
    return {
      isRunning: this.isRunning,
      hashRate: this.currentHashRate,
      efficiency: this.currentEfficiency,
      activeAlgorithm: 'PhaseNU-Adaptive',
      parallelThreads: 512,
      uptime: Date.now() - this.startTime,
    };
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Mining Engine...');
    
    this.isRunning = false;
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
    
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    logger.info('Mining Engine shut down successfully');
  }
}

export const miningEngine = new MiningEngine();
