export interface GPU {
  id: string;
  name: string;
  model: string;
  hashRate: number;
  temperature: number;
  power: number;
  memoryUsed: number;
  memoryTotal: number;
  utilizationRate: number;
  status: 'online' | 'offline' | 'warning' | 'error';
  lastSeen: string;
  createdAt: string;
}

export interface GPUStats {
  total: number;
  online: number;
  offline: number;
  warning: number;
  error: number;
  totalHashRate: number;
  avgTemperature: number;
  totalPower: number;
}

export interface GPUPerformance {
  gpuId: string;
  timestamp: string;
  hashRate: number;
  temperature: number;
  power: number;
  utilizationRate: number;
  memoryUsage: number;
}

export interface GPUOptimizationResult {
  gpuId: string;
  previousHashRate: number;
  newHashRate: number;
  improvement: number;
  status: 'success' | 'failed' | 'no_change';
  message?: string;
}

export type GPUStatus = 'online' | 'offline' | 'warning' | 'error';

export interface GPUThresholds {
  temperatureWarning: number;
  temperatureCritical: number;
  utilizationLow: number;
  powerHigh: number;
  memoryHigh: number;
}
