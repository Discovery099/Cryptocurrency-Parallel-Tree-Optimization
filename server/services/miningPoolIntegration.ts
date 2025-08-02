import { storage } from "../storage";
import { logger } from "../utils/logger";

interface PoolWorker {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  hashRate: number;
  difficulty: number;
  lastSeen: Date;
  sharesAccepted: number;
  sharesRejected: number;
  efficiency: number;
}

interface PoolStats {
  poolName: string;
  workers: number;
  hashRate: number;
  difficulty: number;
  latency: number;
  fee: number;
  paymentMethod: string;
  minimumPayout: number;
  lastBlock: {
    height: number;
    hash: string;
    timestamp: Date;
    reward: number;
  };
  profitability: {
    current: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
}

interface MiningStrategy {
  name: string;
  pools: string[];
  switchingCriteria: {
    profitabilityThreshold: number;
    latencyThreshold: number;
    uptimeThreshold: number;
  };
  schedule?: {
    enabled: boolean;
    timeSlots: Array<{
      start: string;
      end: string;
      pool: string;
    }>;
  };
}

class MiningPoolIntegration {
  private isInitialized = false;
  private poolConnections: Map<string, any> = new Map();
  private workers: Map<string, PoolWorker[]> = new Map();
  private broadcast?: (event: string, data: any) => void;
  private syncInterval?: NodeJS.Timeout;
  private strategyInterval?: NodeJS.Timeout;
  private currentStrategy: MiningStrategy;

  constructor() {
    this.currentStrategy = {
      name: 'Profitability-Based Auto-Switching',
      pools: ['slushpool', 'f2pool', 'antpool', 'binancepool'],
      switchingCriteria: {
        profitabilityThreshold: 5, // Switch if 5% more profitable
        latencyThreshold: 100, // Maximum acceptable latency (ms)
        uptimeThreshold: 99, // Minimum uptime percentage
      },
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Mining Pool Integration Service...');

    try {
      // Initialize connections to major mining pools
      await this.initializePoolConnections();
      
      // Start real-time synchronization
      this.startRealTimeSync();
      
      // Initialize strategy execution
      this.startStrategyExecution();
      
      this.isInitialized = true;
      logger.info('Mining Pool Integration Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Mining Pool Integration Service:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private async initializePoolConnections(): Promise<void> {
    const pools = [
      {
        id: 'slushpool',
        name: 'Slush Pool',
        url: 'stratum+tcp://stratum.slushpool.com',
        port: 4444,
        api: 'https://slushpool.com/api',
      },
      {
        id: 'f2pool',
        name: 'F2Pool',
        url: 'stratum+tcp://stratum.f2pool.com',
        port: 4444,
        api: 'https://api.f2pool.com',
      },
      {
        id: 'antpool',
        name: 'AntPool',
        url: 'stratum+tcp://stratum.antpool.com',
        port: 4444,
        api: 'https://www.antpool.com/api',
      },
      {
        id: 'binancepool',
        name: 'Binance Pool',
        url: 'stratum+tcp://stratum.binance.pool.com',
        port: 8888,
        api: 'https://pool.binance.com/api',
      },
      {
        id: 'poolin',
        name: 'Poolin',
        url: 'stratum+tcp://stratum.ss.poolin.me',
        port: 443,
        api: 'https://api.poolin.me',
      },
    ];

    for (const pool of pools) {
      try {
        const connection = await this.establishPoolConnection(pool);
        this.poolConnections.set(pool.id, connection);
        
        // Initialize workers for this pool
        this.workers.set(pool.id, this.generateMockWorkers(pool.id));
        
        logger.info(`Connected to mining pool: ${pool.name}`);
      } catch (error) {
        logger.error(`Failed to connect to ${pool.name}:`, error);
      }
    }
  }

  private async establishPoolConnection(pool: any): Promise<any> {
    // Simulate pool connection establishment
    return new Promise((resolve) => {
      setTimeout(() => {
        const connection = {
          poolId: pool.id,
          name: pool.name,
          url: pool.url,
          port: pool.port,
          status: 'connected',
          connectedAt: new Date(),
          stats: this.generatePoolStats(pool.name),
        };
        resolve(connection);
      }, Math.random() * 2000 + 500); // 0.5-2.5 second delay
    });
  }

  private generateMockWorkers(poolId: string): PoolWorker[] {
    const workerCount = 3 + Math.floor(Math.random() * 5); // 3-7 workers
    const workers: PoolWorker[] = [];

    for (let i = 1; i <= workerCount; i++) {
      workers.push({
        id: `${poolId}-worker-${i}`,
        name: `Worker-${i}`,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        hashRate: 15 + Math.random() * 30, // 15-45 TH/s
        difficulty: 1000000 + Math.random() * 2000000,
        lastSeen: new Date(Date.now() - Math.random() * 300000), // Within last 5 minutes
        sharesAccepted: Math.floor(Math.random() * 1000),
        sharesRejected: Math.floor(Math.random() * 50),
        efficiency: 85 + Math.random() * 12, // 85-97%
      });
    }

    return workers;
  }

  private generatePoolStats(poolName: string): PoolStats {
    return {
      poolName,
      workers: 3 + Math.floor(Math.random() * 5),
      hashRate: 50 + Math.random() * 100, // Total pool hashrate
      difficulty: 2000000 + Math.random() * 3000000,
      latency: 20 + Math.random() * 80, // 20-100ms
      fee: 1 + Math.random() * 2, // 1-3% fee
      paymentMethod: Math.random() > 0.5 ? 'PPS+' : 'PPLNS',
      minimumPayout: 0.001 + Math.random() * 0.004, // 0.001-0.005 BTC
      lastBlock: {
        height: 800000 + Math.floor(Math.random() * 10000),
        hash: this.generateBlockHash(),
        timestamp: new Date(Date.now() - Math.random() * 3600000), // Within last hour
        reward: 6.25 + Math.random() * 0.5, // 6.25-6.75 BTC
      },
      profitability: {
        current: 100 + (Math.random() - 0.5) * 20, // 90-110% relative profitability
        daily: 0.001 + Math.random() * 0.002, // Daily earnings in BTC
        weekly: 0.007 + Math.random() * 0.014, // Weekly earnings
        monthly: 0.03 + Math.random() * 0.06, // Monthly earnings
      },
    };
  }

  private generateBlockHash(): string {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  private startRealTimeSync(): void {
    this.syncInterval = setInterval(async () => {
      await this.syncPoolData();
      await this.updateWorkerStatus();
      await this.calculateProfitability();
    }, 30000); // Every 30 seconds
  }

  private async syncPoolData(): Promise<void> {
    for (const [poolId, connection] of this.poolConnections.entries()) {
      try {
        // Update pool statistics
        connection.stats = this.generatePoolStats(connection.name);
        
        // Update latency
        connection.stats.latency = await this.measurePoolLatency(poolId);
        
        if (this.broadcast) {
          this.broadcast('pool_stats_updated', {
            poolId,
            stats: connection.stats,
            timestamp: new Date(),
          });
        }
      } catch (error) {
        logger.error(`Failed to sync data for pool ${poolId}:`, error);
      }
    }
  }

  private async measurePoolLatency(poolId: string): Promise<number> {
    // Simulate latency measurement
    return new Promise((resolve) => {
      const start = Date.now();
      setTimeout(() => {
        const latency = Date.now() - start + Math.random() * 50; // Add some randomness
        resolve(latency);
      }, Math.random() * 100 + 20); // 20-120ms
    });
  }

  private async updateWorkerStatus(): Promise<void> {
    for (const [poolId, workers] of this.workers.entries()) {
      for (const worker of workers) {
        // Simulate worker status updates
        if (Math.random() < 0.1) { // 10% chance of status change
          worker.status = worker.status === 'active' ? 'inactive' : 'active';
        }

        if (worker.status === 'active') {
          // Update mining metrics
          worker.hashRate += (Math.random() - 0.5) * 5; // ±2.5 TH/s variation
          worker.hashRate = Math.max(5, worker.hashRate);
          
          worker.sharesAccepted += Math.floor(Math.random() * 10);
          if (Math.random() < 0.05) { // 5% chance of rejected share
            worker.sharesRejected += 1;
          }
          
          worker.efficiency = (worker.sharesAccepted / Math.max(1, worker.sharesAccepted + worker.sharesRejected)) * 100;
          worker.lastSeen = new Date();
        }
      }

      if (this.broadcast) {
        this.broadcast('workers_updated', {
          poolId,
          workers: workers.filter(w => w.status === 'active'),
          timestamp: new Date(),
        });
      }
    }
  }

  private async calculateProfitability(): Promise<void> {
    const profitabilityData: Record<string, number> = {};
    
    for (const [poolId, connection] of this.poolConnections.entries()) {
      const stats = connection.stats;
      
      // Calculate profitability score based on multiple factors
      let profitability = 100; // Base score
      
      // Fee impact (lower is better)
      profitability -= stats.fee * 10;
      
      // Latency impact (lower is better)
      profitability -= Math.max(0, (stats.latency - 50) / 10);
      
      // Difficulty impact (higher difficulty = more stable but potentially lower immediate returns)
      const difficultyScore = Math.min(10, stats.difficulty / 500000);
      profitability += difficultyScore;
      
      // Recent block finding impact
      const timeSinceLastBlock = Date.now() - stats.lastBlock.timestamp.getTime();
      const hoursSinceBlock = timeSinceLastBlock / (1000 * 60 * 60);
      if (hoursSinceBlock < 1) profitability += 15; // Recent block bonus
      else if (hoursSinceBlock > 6) profitability -= 10; // Penalty for old blocks
      
      // Worker efficiency impact
      const workers = this.workers.get(poolId) || [];
      const avgEfficiency = workers.length > 0 ? 
        workers.reduce((sum, w) => sum + w.efficiency, 0) / workers.length : 85;
      profitability += (avgEfficiency - 85) * 0.5;
      
      profitabilityData[poolId] = Math.max(0, profitability);
    }

    if (this.broadcast) {
      this.broadcast('profitability_updated', {
        profitability: profitabilityData,
        timestamp: new Date(),
      });
    }

    // Check if we should switch pools based on profitability
    await this.evaluatePoolSwitching(profitabilityData);
  }

  private async evaluatePoolSwitching(profitabilityData: Record<string, number>): Promise<void> {
    const currentPool = await storage.getActiveMiningPool();
    if (!currentPool) return;

    const currentProfitability = profitabilityData[currentPool.name.toLowerCase().replace(/\s+/g, '')] || 0;
    
    // Find the most profitable pool
    let bestPool = '';
    let bestProfitability = 0;
    
    for (const [poolId, profitability] of Object.entries(profitabilityData)) {
      if (profitability > bestProfitability) {
        bestProfitability = profitability;
        bestPool = poolId;
      }
    }

    // Check if switching is beneficial
    const profitabilityDifference = bestProfitability - currentProfitability;
    const improvementPercent = (profitabilityDifference / Math.max(1, currentProfitability)) * 100;

    if (improvementPercent >= this.currentStrategy.switchingCriteria.profitabilityThreshold) {
      await this.recommendPoolSwitch(bestPool, improvementPercent);
    }
  }

  private async recommendPoolSwitch(recommendedPoolId: string, improvementPercent: number): Promise<void> {
    const connection = this.poolConnections.get(recommendedPoolId);
    if (!connection) return;

    const recommendation = {
      currentPool: (await storage.getActiveMiningPool())?.name || 'Unknown',
      recommendedPool: connection.name,
      improvementPercent: Math.round(improvementPercent * 100) / 100,
      reasons: [
        `${improvementPercent.toFixed(1)}% higher profitability`,
        `Lower latency: ${connection.stats.latency}ms`,
        `Fee: ${connection.stats.fee}%`,
        `Recent block found ${Math.round((Date.now() - connection.stats.lastBlock.timestamp.getTime()) / (1000 * 60))} minutes ago`,
      ],
      riskLevel: improvementPercent > 15 ? 'low' : 'medium',
      confidence: Math.min(95, 60 + improvementPercent * 2),
    };

    if (this.broadcast) {
      this.broadcast('pool_switch_recommendation', {
        recommendation,
        timestamp: new Date(),
      });
    }

    // Auto-switch if improvement is significant and low risk
    if (improvementPercent > 10 && recommendation.riskLevel === 'low') {
      await this.performPoolSwitch(recommendedPoolId);
    }
  }

  private async performPoolSwitch(newPoolId: string): Promise<void> {
    const connection = this.poolConnections.get(newPoolId);
    if (!connection) return;

    try {
      // Find or create the mining pool in database
      const pools = await storage.getMiningPools();
      let targetPool = pools.find(p => p.name.toLowerCase().includes(newPoolId));

      if (!targetPool) {
        // Create new pool entry
        targetPool = await storage.createMiningPool({
          name: connection.name,
          url: connection.url,
          port: connection.port,
          username: 'auto-generated',
          password: 'x',
          isActive: false,
          priority: 1,
        });
      }

      // Perform the switch
      await storage.setActiveMiningPool(targetPool.id);
      
      logger.info(`Automatically switched to mining pool: ${connection.name}`);

      if (this.broadcast) {
        this.broadcast('pool_switched', {
          oldPool: pools.find(p => p.isActive)?.name || 'Unknown',
          newPool: connection.name,
          reason: 'automated_profitability_optimization',
          timestamp: new Date(),
        });
      }

    } catch (error) {
      logger.error(`Failed to switch to pool ${newPoolId}:`, error);
    }
  }

  private startStrategyExecution(): void {
    this.strategyInterval = setInterval(async () => {
      await this.executeStrategy();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  private async executeStrategy(): Promise<void> {
    if (this.currentStrategy.schedule?.enabled) {
      await this.executeScheduledStrategy();
    }

    // Monitor strategy performance
    await this.evaluateStrategyPerformance();
  }

  private async executeScheduledStrategy(): Promise<void> {
    if (!this.currentStrategy.schedule) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    for (const slot of this.currentStrategy.schedule.timeSlots) {
      if (currentTime >= slot.start && currentTime <= slot.end) {
        const targetPool = slot.pool;
        const currentPool = await storage.getActiveMiningPool();
        
        if (!currentPool || !currentPool.name.toLowerCase().includes(targetPool)) {
          await this.performPoolSwitch(targetPool);
          logger.info(`Scheduled pool switch to ${targetPool} executed`);
        }
        break;
      }
    }
  }

  private async evaluateStrategyPerformance(): Promise<void> {
    // Analyze performance over the last hour
    const metrics = await storage.getSystemMetricsHistory(1);
    
    if (metrics.length > 0) {
      const avgHashRate = metrics.reduce((sum, m) => sum + m.totalHashRate, 0) / metrics.length;
      const avgEfficiency = metrics.reduce((sum, m) => sum + m.treeEfficiency, 0) / metrics.length;
      
      const performance = {
        strategy: this.currentStrategy.name,
        avgHashRate,
        avgEfficiency,
        poolSwitches: 0, // Would track actual switches
        estimatedDailyRevenue: avgHashRate * 0.00001, // Simplified calculation
        timestamp: new Date(),
      };

      if (this.broadcast) {
        this.broadcast('strategy_performance', performance);
      }
    }
  }

  async getPoolStats(poolId?: string): Promise<PoolStats[]> {
    if (poolId) {
      const connection = this.poolConnections.get(poolId);
      return connection ? [connection.stats] : [];
    }

    return Array.from(this.poolConnections.values()).map(conn => conn.stats);
  }

  async getWorkers(poolId?: string): Promise<Record<string, PoolWorker[]>> {
    if (poolId) {
      const workers = this.workers.get(poolId);
      return workers ? { [poolId]: workers } : {};
    }

    const result: Record<string, PoolWorker[]> = {};
    for (const [id, workers] of this.workers.entries()) {
      result[id] = workers;
    }
    return result;
  }

  async updateStrategy(strategy: Partial<MiningStrategy>): Promise<void> {
    this.currentStrategy = {
      ...this.currentStrategy,
      ...strategy,
    };

    logger.info(`Updated mining strategy: ${this.currentStrategy.name}`);

    if (this.broadcast) {
      this.broadcast('strategy_updated', {
        strategy: this.currentStrategy,
        timestamp: new Date(),
      });
    }
  }

  getCurrentStrategy(): MiningStrategy {
    return this.currentStrategy;
  }

  async getIntegrationStatus(): Promise<any> {
    const connectedPools = Array.from(this.poolConnections.values());
    const totalWorkers = Array.from(this.workers.values()).reduce((sum, workers) => sum + workers.length, 0);
    const activeWorkers = Array.from(this.workers.values()).reduce((sum, workers) => 
      sum + workers.filter(w => w.status === 'active').length, 0);

    return {
      isInitialized: this.isInitialized,
      connectedPools: connectedPools.length,
      totalWorkers,
      activeWorkers,
      currentStrategy: this.currentStrategy.name,
      poolNames: connectedPools.map(p => p.name),
      averageLatency: connectedPools.reduce((sum, p) => sum + p.stats.latency, 0) / Math.max(1, connectedPools.length),
      totalHashRate: connectedPools.reduce((sum, p) => sum + p.stats.hashRate, 0),
    };
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Mining Pool Integration Service...');
    
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    if (this.strategyInterval) {
      clearInterval(this.strategyInterval);
    }
    
    // Close all pool connections
    for (const [poolId, connection] of this.poolConnections.entries()) {
      logger.info(`Disconnecting from pool: ${connection.name}`);
    }
    
    this.poolConnections.clear();
    this.workers.clear();
    
    this.isInitialized = false;
    logger.info('Mining Pool Integration Service shut down successfully');
  }
}

export const miningPoolIntegration = new MiningPoolIntegration();