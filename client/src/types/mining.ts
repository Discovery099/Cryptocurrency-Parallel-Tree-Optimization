export interface MiningMetrics {
  hashRate: number;
  hashRateChange: number;
  efficiency: number;
  efficiencyChange: number;
  activeGPUs: string;
  revenue: number;
  revenueChange: number;
  systemHealth: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  networkLoad: number;
  transactionsProcessed: number;
  transactionsPending: number;
}

export interface MiningPool {
  id: string;
  name: string;
  url: string;
  port: number;
  username: string;
  password?: string;
  difficulty?: number;
  latency: number;
  status: 'connected' | 'disconnected' | 'standby';
  isActive: boolean;
  priority: number;
  workers: number;
  createdAt: string;
  updatedAt: string;
}

export interface MerkleTreeConfig {
  id: string;
  name: string;
  parallelThreads: number;
  treeDepth: string;
  cacheStrategy: string;
  isActive: boolean;
  performance: any;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionBatch {
  id: string;
  batchSize: number;
  processingTime: number;
  merkleRoot: string;
  algorithm: string;
  networkType: string;
  efficiency: number;
  gpuIds: string[];
  createdAt: string;
}

export interface SystemConfig {
  id: string;
  key: string;
  value: any;
  category: string;
  description?: string;
  updatedAt: string;
}

export interface PerformanceAnalytics {
  averageHashRate: number;
  peakHashRate: number;
  averageEfficiency: number;
  uptimePercentage: number;
  totalTransactions: number;
  averageProcessingTime: number;
  errorRate: number;
}

export interface ChartDataPoint {
  timestamp: string;
  hashRate: number;
  efficiency: number;
  temperature: number;
  power: number;
}
