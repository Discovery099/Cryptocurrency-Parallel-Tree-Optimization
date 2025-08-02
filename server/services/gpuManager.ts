import { storage } from "../storage";
import { alertService } from "./alertService";
import { logger } from "../utils/logger";
import type { GPU } from "@shared/schema";

interface GPUStatus {
  total: number;
  online: number;
  offline: number;
  warning: number;
  error: number;
}

class GPUManager {
  private isInitialized = false;
  private broadcast?: (event: string, data: any) => void;
  private monitoringInterval?: NodeJS.Timeout;
  private simulatedGPUs: Map<string, any> = new Map();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing GPU Manager...');

    try {
      // Create initial GPU setup if none exist
      await this.setupInitialGPUs();
      
      // Start monitoring
      this.startMonitoring();
      
      this.isInitialized = true;
      logger.info('GPU Manager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize GPU Manager:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private async setupInitialGPUs(): Promise<void> {
    const existingGPUs = await storage.getGPUs();
    
    if (existingGPUs.length === 0) {
      logger.info('Setting up initial GPU configuration...');
      
      const initialGPUs = [
        { name: 'RTX 4090 #1', model: 'NVIDIA RTX 4090', hashRate: 14.2, temperature: 67, power: 320, memoryUsed: 18.5, memoryTotal: 24.0, utilizationRate: 89, status: 'online' },
        { name: 'RTX 4090 #2', model: 'NVIDIA RTX 4090', hashRate: 14.1, temperature: 71, power: 315, memoryUsed: 19.2, memoryTotal: 24.0, utilizationRate: 92, status: 'online' },
        { name: 'RTX 4090 #3', model: 'NVIDIA RTX 4090', hashRate: 12.8, temperature: 83, power: 340, memoryUsed: 20.1, memoryTotal: 24.0, utilizationRate: 78, status: 'warning' },
        { name: 'RTX 4080 #1', model: 'NVIDIA RTX 4080', hashRate: 11.5, temperature: 65, power: 280, memoryUsed: 14.2, memoryTotal: 16.0, utilizationRate: 85, status: 'online' },
        { name: 'RTX 4080 #2', model: 'NVIDIA RTX 4080', hashRate: 11.3, temperature: 69, power: 275, memoryUsed: 13.8, memoryTotal: 16.0, utilizationRate: 87, status: 'online' },
        { name: 'RTX 3090 #1', model: 'NVIDIA RTX 3090', hashRate: 10.2, temperature: 74, power: 350, memoryUsed: 22.1, memoryTotal: 24.0, utilizationRate: 82, status: 'online' },
      ];

      for (const gpuData of initialGPUs) {
        const gpu = await storage.createGPU(gpuData);
        this.simulatedGPUs.set(gpu.id, { ...gpuData, id: gpu.id });
      }
    } else {
      // Load existing GPUs into simulation
      for (const gpu of existingGPUs) {
        this.simulatedGPUs.set(gpu.id, gpu);
      }
    }
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.updateGPUMetrics();
      } catch (error) {
        logger.error('Error updating GPU metrics:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  private async updateGPUMetrics(): Promise<void> {
    const gpus = await storage.getGPUs();
    const updates: Promise<any>[] = [];

    for (const gpu of gpus) {
      const simGPU = this.simulatedGPUs.get(gpu.id);
      if (!simGPU) continue;

      // Simulate realistic GPU behavior
      const newMetrics = this.simulateGPUBehavior(simGPU);
      
      // Update database
      const updatePromise = storage.updateGPU(gpu.id, newMetrics);
      updates.push(updatePromise);
      
      // Update simulation state
      this.simulatedGPUs.set(gpu.id, { ...simGPU, ...newMetrics });
    }

    const updatedGPUs = await Promise.all(updates);
    
    // Broadcast updates
    if (this.broadcast) {
      this.broadcast('gpu_metrics_update', updatedGPUs.filter(Boolean));
    }

    // Check for alerts
    await this.checkGPUAlerts(updatedGPUs.filter(Boolean));
  }

  private simulateGPUBehavior(gpu: any): Partial<GPU> {
    const updates: Partial<GPU> = {};
    
    // Temperature simulation with realistic fluctuation
    const tempVariation = (Math.random() - 0.5) * 4; // ±2°C variation
    let newTemp = gpu.temperature + tempVariation;
    
    // Temperature bounds based on load
    const minTemp = 45;
    const maxTemp = gpu.status === 'error' ? 95 : 90;
    newTemp = Math.max(minTemp, Math.min(maxTemp, newTemp));
    updates.temperature = Math.round(newTemp);

    // Hash rate based on temperature and status
    let hashRateMultiplier = 1.0;
    if (newTemp > 85) {
      hashRateMultiplier = 0.85; // Thermal throttling
    } else if (newTemp > 80) {
      hashRateMultiplier = 0.92;
    }
    
    const baseHashRate = gpu.model.includes('4090') ? 14.2 : gpu.model.includes('4080') ? 11.5 : 10.2;
    updates.hashRate = Math.round(baseHashRate * hashRateMultiplier * 10) / 10;

    // Power consumption based on load and temperature
    const basePower = gpu.model.includes('4090') ? 320 : gpu.model.includes('4080') ? 280 : 350;
    const powerVariation = (newTemp - 65) * 0.5 + (Math.random() - 0.5) * 20;
    updates.power = Math.max(200, Math.min(400, Math.round(basePower + powerVariation)));

    // Utilization rate
    const utilizationVariation = (Math.random() - 0.5) * 10;
    updates.utilizationRate = Math.max(60, Math.min(100, Math.round(gpu.utilizationRate + utilizationVariation)));

    // Memory usage simulation
    const memoryVariation = (Math.random() - 0.5) * 1.0;
    updates.memoryUsed = Math.max(8, Math.min(gpu.memoryTotal - 1, gpu.memoryUsed + memoryVariation));

    // Status determination
    if (newTemp > 90) {
      updates.status = 'error';
    } else if (newTemp > 80 || updates.utilizationRate < 70) {
      updates.status = 'warning';
    } else {
      updates.status = 'online';
    }

    return updates;
  }

  private async checkGPUAlerts(gpus: GPU[]): Promise<void> {
    for (const gpu of gpus) {
      // Temperature alerts
      if (gpu.temperature > 90) {
        await alertService.createAlert({
          type: 'error',
          title: 'Critical GPU Temperature',
          message: `${gpu.name} is critically overheating at ${gpu.temperature}°C`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'critical',
        });
      } else if (gpu.temperature > 85) {
        await alertService.createAlert({
          type: 'warning',
          title: 'High GPU Temperature',
          message: `${gpu.name} temperature is ${gpu.temperature}°C`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'high',
        });
      }

      // Performance alerts
      if (gpu.utilizationRate < 60) {
        await alertService.createAlert({
          type: 'warning',
          title: 'Low GPU Utilization',
          message: `${gpu.name} utilization is only ${gpu.utilizationRate}%`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'medium',
        });
      }

      // Power alerts
      if (gpu.power > 380) {
        await alertService.createAlert({
          type: 'warning',
          title: 'High Power Consumption',
          message: `${gpu.name} consuming ${gpu.power}W`,
          source: 'gpu',
          sourceId: gpu.id,
          severity: 'medium',
        });
      }
    }
  }

  async optimizeAll(): Promise<void> {
    logger.info('Starting GPU optimization...');
    
    const gpus = await storage.getGPUs();
    const optimizationPromises = gpus.map(gpu => this.optimizeGPU(gpu.id));
    
    await Promise.all(optimizationPromises);
    
    await alertService.createAlert({
      type: 'success',
      title: 'GPU Optimization Complete',
      message: `Optimized ${gpus.length} GPUs for maximum performance`,
      source: 'system',
      severity: 'low',
    });

    logger.info('GPU optimization completed');
  }

  async optimizeGPU(gpuId: string): Promise<void> {
    const gpu = await storage.getGPU(gpuId);
    if (!gpu) return;

    // Simulate optimization by improving metrics
    const optimizedMetrics: Partial<GPU> = {
      temperature: Math.max(60, gpu.temperature - 5),
      utilizationRate: Math.min(95, gpu.utilizationRate + 10),
      status: gpu.temperature <= 85 ? 'online' : gpu.status,
    };

    // Recalculate hash rate based on optimized temperature
    const baseHashRate = gpu.model.includes('4090') ? 14.2 : gpu.model.includes('4080') ? 11.5 : 10.2;
    if (optimizedMetrics.temperature! <= 75) {
      optimizedMetrics.hashRate = baseHashRate;
    }

    await storage.updateGPU(gpuId, optimizedMetrics);
    
    // Update simulation state
    const simGPU = this.simulatedGPUs.get(gpuId);
    if (simGPU) {
      this.simulatedGPUs.set(gpuId, { ...simGPU, ...optimizedMetrics });
    }

    if (this.broadcast) {
      this.broadcast('gpu_optimized', { id: gpuId, ...optimizedMetrics });
    }
  }

  async getGPUStatus(): Promise<GPUStatus> {
    const gpus = await storage.getGPUs();
    
    return {
      total: gpus.length,
      online: gpus.filter(gpu => gpu.status === 'online').length,
      offline: gpus.filter(gpu => gpu.status === 'offline').length,
      warning: gpus.filter(gpu => gpu.status === 'warning').length,
      error: gpus.filter(gpu => gpu.status === 'error').length,
    };
  }

  getStatus() {
    return {
      isInitialized: this.isInitialized,
      monitoredGPUs: this.simulatedGPUs.size,
      isMonitoring: !!this.monitoringInterval,
    };
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down GPU Manager...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    this.simulatedGPUs.clear();
    logger.info('GPU Manager shut down successfully');
  }
}

export const gpuManager = new GPUManager();
