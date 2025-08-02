import { storage } from "../storage";
import { alertService } from "./alertService";
import { logger } from "../utils/logger";
import type { SystemConfig } from "@shared/schema";

interface ConfigurationContext {
  gpuCount: number;
  totalMemory: number;
  availableCores: number;
  networkBandwidth: number;
}

class ConfigService {
  private isInitialized = false;
  private activeConfigs: Map<string, any> = new Map();
  private configContext: ConfigurationContext = {
    gpuCount: 0,
    totalMemory: 0,
    availableCores: 0,
    networkBandwidth: 0,
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Configuration Service...');

    try {
      // Load existing configurations
      await this.loadConfigurations();
      
      // Initialize system context
      await this.initializeSystemContext();
      
      // Apply default configurations if none exist
      await this.ensureDefaultConfigurations();
      
      this.isInitialized = true;
      logger.info('Configuration Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Configuration Service:', error);
      throw error;
    }
  }

  private async loadConfigurations(): Promise<void> {
    const configs = await storage.getSystemConfigs();
    
    for (const config of configs) {
      this.activeConfigs.set(config.key, config.value);
    }
    
    logger.info(`Loaded ${configs.length} system configurations`);
  }

  private async initializeSystemContext(): Promise<void> {
    // Get system information for intelligent configuration
    const gpus = await storage.getGPUs();
    
    this.configContext = {
      gpuCount: gpus.length,
      totalMemory: gpus.reduce((sum, gpu) => sum + gpu.memoryTotal, 0),
      availableCores: process.env.NODE_ENV === 'production' ? 32 : 16, // Simulate based on environment
      networkBandwidth: 1000, // Mbps - would be detected in real implementation
    };
    
    logger.info('System context initialized:', this.configContext);
  }

  private async ensureDefaultConfigurations(): Promise<void> {
    const defaultConfigs = [
      {
        key: 'mining.parallel_threads',
        value: this.calculateOptimalThreads(),
        category: 'algorithm',
        description: 'Number of parallel threads for Merkle tree construction',
      },
      {
        key: 'mining.tree_depth',
        value: 'auto',
        category: 'algorithm',
        description: 'Merkle tree depth optimization strategy',
      },
      {
        key: 'mining.cache_strategy',
        value: 'adaptive',
        category: 'algorithm',
        description: 'Cache strategy for tree node storage',
      },
      {
        key: 'gpu.memory_allocation',
        value: 75,
        category: 'hardware',
        description: 'GPU memory allocation percentage',
      },
      {
        key: 'gpu.cuda_enabled',
        value: true,
        category: 'hardware',
        description: 'Enable CUDA acceleration',
      },
      {
        key: 'gpu.power_management',
        value: true,
        category: 'hardware',
        description: 'Auto power management enabled',
      },
      {
        key: 'gpu.temperature_throttle',
        value: true,
        category: 'hardware',
        description: 'Temperature-based throttling enabled',
      },
      {
        key: 'network.failover_timeout',
        value: 30,
        category: 'network',
        description: 'Pool failover timeout in seconds',
      },
      {
        key: 'network.max_connections',
        value: 50,
        category: 'network',
        description: 'Maximum concurrent connections',
      },
      {
        key: 'network.load_balancing',
        value: true,
        category: 'network',
        description: 'Enable load balancing across pools',
      },
    ];

    for (const config of defaultConfigs) {
      const existing = await storage.getSystemConfig(config.key);
      if (!existing) {
        await storage.setSystemConfig(config);
        this.activeConfigs.set(config.key, config.value);
      }
    }
  }

  private calculateOptimalThreads(): number {
    const { gpuCount, availableCores } = this.configContext;
    
    // Base calculation on GPU cores and CPU cores
    const gpuThreads = gpuCount * 2048; // Approximate threads per GPU
    const cpuThreads = availableCores * 8; // Threads per CPU core
    
    // Calculate optimal thread count with diminishing returns
    const totalThreads = Math.min(gpuThreads + cpuThreads, 1024);
    
    // Ensure power of 2 for optimal parallel processing
    return Math.pow(2, Math.floor(Math.log2(totalThreads)));
  }

  async applyConfiguration(key: string, value: any): Promise<void> {
    logger.info(`Applying configuration: ${key} = ${JSON.stringify(value)}`);

    try {
      // Validate configuration value
      await this.validateConfiguration(key, value);
      
      // Store in database
      await storage.updateSystemConfig(key, value);
      
      // Update active config
      this.activeConfigs.set(key, value);
      
      // Apply configuration to relevant services
      await this.applyToServices(key, value);
      
      await alertService.createSystemAlert(
        'Configuration Updated',
        `${key} has been updated successfully`,
        'low'
      );
      
      logger.info(`Configuration applied successfully: ${key}`);
    } catch (error) {
      logger.error(`Failed to apply configuration ${key}:`, error);
      throw error;
    }
  }

  async applyBulkConfiguration(configs: Record<string, any>): Promise<void> {
    logger.info('Applying bulk configuration changes...');

    const errors: string[] = [];
    const applied: string[] = [];

    for (const [key, value] of Object.entries(configs)) {
      try {
        await this.applyConfiguration(key, value);
        applied.push(key);
      } catch (error) {
        errors.push(`${key}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      await alertService.createSystemAlert(
        'Bulk Configuration Errors',
        `${errors.length} configuration(s) failed to apply: ${errors.join(', ')}`,
        'medium'
      );
    }

    if (applied.length > 0) {
      await alertService.createSystemAlert(
        'Bulk Configuration Applied',
        `Successfully applied ${applied.length} configuration(s)`,
        'low'
      );
    }

    logger.info(`Bulk configuration completed: ${applied.length} applied, ${errors.length} errors`);
  }

  private async validateConfiguration(key: string, value: any): Promise<void> {
    const validators: Record<string, (val: any) => boolean> = {
      'mining.parallel_threads': (val) => typeof val === 'number' && val >= 1 && val <= 2048,
      'mining.tree_depth': (val) => ['auto', '8', '16', '32'].includes(val),
      'mining.cache_strategy': (val) => ['lru', 'lfu', 'adaptive'].includes(val),
      'gpu.memory_allocation': (val) => typeof val === 'number' && val >= 50 && val <= 90,
      'gpu.cuda_enabled': (val) => typeof val === 'boolean',
      'gpu.power_management': (val) => typeof val === 'boolean',
      'gpu.temperature_throttle': (val) => typeof val === 'boolean',
      'network.failover_timeout': (val) => typeof val === 'number' && val >= 10 && val <= 300,
      'network.max_connections': (val) => typeof val === 'number' && val >= 1 && val <= 100,
      'network.load_balancing': (val) => typeof val === 'boolean',
    };

    const validator = validators[key];
    if (validator && !validator(value)) {
      throw new Error(`Invalid value for configuration ${key}: ${JSON.stringify(value)}`);
    }
  }

  private async applyToServices(key: string, value: any): Promise<void> {
    // Apply configuration changes to relevant services
    switch (key) {
      case 'mining.parallel_threads':
      case 'mining.tree_depth':
      case 'mining.cache_strategy':
        // Would trigger merkle tree service reconfiguration
        logger.info(`Merkle tree configuration updated: ${key}`);
        break;
        
      case 'gpu.memory_allocation':
      case 'gpu.cuda_enabled':
      case 'gpu.power_management':
      case 'gpu.temperature_throttle':
        // Would trigger GPU manager reconfiguration
        logger.info(`GPU configuration updated: ${key}`);
        break;
        
      case 'network.failover_timeout':
      case 'network.max_connections':
      case 'network.load_balancing':
        // Would trigger mining pool service reconfiguration
        logger.info(`Network configuration updated: ${key}`);
        break;
    }
  }

  getConfiguration(key: string): any {
    return this.activeConfigs.get(key);
  }

  getAllConfigurations(): Record<string, any> {
    return Object.fromEntries(this.activeConfigs.entries());
  }

  async optimizeConfiguration(): Promise<void> {
    logger.info('Starting intelligent configuration optimization...');

    try {
      // Get current system performance
      const metrics = await storage.getLatestSystemMetrics();
      if (!metrics) {
        throw new Error('No metrics available for optimization');
      }

      const optimizations: Record<string, any> = {};

      // Optimize parallel threads based on efficiency
      if (metrics.treeEfficiency < 90) {
        const currentThreads = this.getConfiguration('mining.parallel_threads') || 512;
        const optimalThreads = this.calculateOptimalThreadsBasedOnPerformance(metrics);
        
        if (optimalThreads !== currentThreads) {
          optimizations['mining.parallel_threads'] = optimalThreads;
        }
      }

      // Optimize cache strategy based on hit rate simulation
      const cacheEfficiency = this.simulateCacheEfficiency(metrics);
      if (cacheEfficiency.recommendedStrategy !== this.getConfiguration('mining.cache_strategy')) {
        optimizations['mining.cache_strategy'] = cacheEfficiency.recommendedStrategy;
      }

      // Optimize GPU memory allocation based on utilization
      const gpus = await storage.getGPUs();
      const avgMemoryUsage = gpus.reduce((sum, gpu) => sum + (gpu.memoryUsed / gpu.memoryTotal), 0) / gpus.length * 100;
      const currentAllocation = this.getConfiguration('gpu.memory_allocation') || 75;
      
      if (avgMemoryUsage > 85 && currentAllocation < 85) {
        optimizations['gpu.memory_allocation'] = Math.min(85, currentAllocation + 5);
      } else if (avgMemoryUsage < 60 && currentAllocation > 60) {
        optimizations['gpu.memory_allocation'] = Math.max(60, currentAllocation - 5);
      }

      // Apply optimizations
      if (Object.keys(optimizations).length > 0) {
        await this.applyBulkConfiguration(optimizations);
        
        await alertService.createSystemAlert(
          'Configuration Optimized',
          `Applied ${Object.keys(optimizations).length} optimization(s) based on performance analysis`,
          'low'
        );
      } else {
        await alertService.createSystemAlert(
          'Configuration Already Optimal',
          'Current configuration is already optimized for current performance metrics',
          'low'
        );
      }

      logger.info('Configuration optimization completed');
    } catch (error) {
      logger.error('Configuration optimization failed:', error);
      throw error;
    }
  }

  private calculateOptimalThreadsBasedOnPerformance(metrics: any): number {
    const efficiency = metrics.treeEfficiency;
    const currentThreads = this.getConfiguration('mining.parallel_threads') || 512;
    
    if (efficiency < 85) {
      // Reduce threads if efficiency is very low
      return Math.max(256, Math.floor(currentThreads * 0.8));
    } else if (efficiency > 95) {
      // Increase threads if efficiency is very high
      return Math.min(1024, Math.floor(currentThreads * 1.2));
    }
    
    return currentThreads;
  }

  private simulateCacheEfficiency(metrics: any): { recommendedStrategy: string; efficiency: number } {
    const memoryUsage = metrics.memoryUsage;
    const efficiency = metrics.treeEfficiency;
    
    if (memoryUsage > 85) {
      return { recommendedStrategy: 'lfu', efficiency: 92 };
    } else if (efficiency > 95) {
      return { recommendedStrategy: 'adaptive', efficiency: 97 };
    } else {
      return { recommendedStrategy: 'lru', efficiency: 89 };
    }
  }

  async exportConfiguration(): Promise<string> {
    const configs = await storage.getSystemConfigs();
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      configurations: configs,
      systemContext: this.configContext,
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async importConfiguration(configData: string): Promise<void> {
    try {
      const data = JSON.parse(configData);
      
      if (!data.configurations || !Array.isArray(data.configurations)) {
        throw new Error('Invalid configuration data format');
      }
      
      const configsToApply: Record<string, any> = {};
      
      for (const config of data.configurations) {
        configsToApply[config.key] = config.value;
      }
      
      await this.applyBulkConfiguration(configsToApply);
      
      await alertService.createSystemAlert(
        'Configuration Imported',
        `Successfully imported ${data.configurations.length} configuration(s)`,
        'low'
      );
      
      logger.info('Configuration import completed successfully');
    } catch (error) {
      logger.error('Configuration import failed:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      activeConfigs: this.activeConfigs.size,
      systemContext: this.configContext,
    };
  }
}

export const configService = new ConfigService();
