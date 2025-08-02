import { storage } from "../storage";
import { alertService } from "./alertService";
import { logger } from "../utils/logger";
import type { MiningPool } from "@shared/schema";

interface PoolConnection {
  pool: MiningPool;
  socket?: any;
  isConnected: boolean;
  lastPing: Date;
  connectionAttempts: number;
}

class MiningPoolService {
  private isInitialized = false;
  private connections: Map<string, PoolConnection> = new Map();
  private activePoolId?: string;
  private monitoringInterval?: NodeJS.Timeout;
  private reconnectInterval?: NodeJS.Timeout;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Mining Pool Service...');

    try {
      // Setup initial pools if none exist
      await this.setupInitialPools();
      
      // Load existing pools
      await this.loadPools();
      
      // Start monitoring
      this.startMonitoring();
      
      this.isInitialized = true;
      logger.info('Mining Pool Service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Mining Pool Service:', error);
      throw error;
    }
  }

  private async setupInitialPools(): Promise<void> {
    const existingPools = await storage.getMiningPools();
    
    if (existingPools.length === 0) {
      logger.info('Setting up initial mining pools...');
      
      const initialPools = [
        {
          name: 'SlushPool',
          url: 'stratum+tcp://stratum.slushpool.com',
          port: 4444,
          username: 'mining_user_1',
          password: 'x',
          difficulty: 43200000000000,
          latency: 12,
          status: 'connected',
          isActive: true,
          priority: 1,
          workers: 24,
        },
        {
          name: 'F2Pool',
          url: 'stratum+tcp://stratum.f2pool.com',
          port: 4444,
          username: 'mining_user_2',
          password: 'x',
          difficulty: 41800000000000,
          latency: 18,
          status: 'standby',
          isActive: false,
          priority: 2,
          workers: 0,
        },
        {
          name: 'AntPool',
          url: 'stratum+tcp://stratum.antpool.com',
          port: 4444,
          username: 'mining_user_3',
          password: 'x',
          difficulty: 42500000000000,
          latency: 24,
          status: 'standby',
          isActive: false,
          priority: 3,
          workers: 0,
        },
      ];

      for (const poolData of initialPools) {
        await storage.createMiningPool(poolData);
      }
    }
  }

  private async loadPools(): Promise<void> {
    const pools = await storage.getMiningPools();
    
    for (const pool of pools) {
      const connection: PoolConnection = {
        pool,
        isConnected: pool.status === 'connected',
        lastPing: new Date(),
        connectionAttempts: 0,
      };
      
      this.connections.set(pool.id, connection);
      
      if (pool.isActive) {
        this.activePoolId = pool.id;
        await this.connectToPool(pool.id);
      }
    }
  }

  private startMonitoring(): void {
    // Monitor pool connections
    this.monitoringInterval = setInterval(async () => {
      await this.monitorConnections();
    }, 10000); // Check every 10 seconds

    // Attempt reconnections
    this.reconnectInterval = setInterval(async () => {
      await this.attemptReconnections();
    }, 30000); // Reconnect attempts every 30 seconds
  }

  private async monitorConnections(): Promise<void> {
    for (const [poolId, connection] of this.connections.entries()) {
      try {
        if (connection.isConnected) {
          // Simulate ping to check connection health
          const latency = await this.pingPool(connection.pool);
          
          await storage.updateMiningPool(poolId, {
            latency,
            status: 'connected',
          });

          // Update connection info
          connection.lastPing = new Date();
          
          // Simulate connection issues occasionally
          if (Math.random() < 0.05) { // 5% chance of connection issue
            connection.isConnected = false;
            await storage.updateMiningPool(poolId, {
              status: 'disconnected',
              workers: 0,
            });
            
            await alertService.createAlert({
              type: 'warning',
              title: 'Mining Pool Disconnected',
              message: `Lost connection to ${connection.pool.name}`,
              source: 'pool',
              sourceId: poolId,
              severity: 'high',
            });
          }
        }
      } catch (error) {
        logger.error(`Error monitoring pool ${connection.pool.name}:`, error);
      }
    }
  }

  private async attemptReconnections(): Promise<void> {
    for (const [poolId, connection] of this.connections.entries()) {
      if (!connection.isConnected && connection.connectionAttempts < 3) {
        try {
          logger.info(`Attempting to reconnect to ${connection.pool.name}...`);
          
          const success = await this.connectToPool(poolId);
          if (success) {
            connection.connectionAttempts = 0;
            
            await alertService.createAlert({
              type: 'success',
              title: 'Mining Pool Reconnected',
              message: `Successfully reconnected to ${connection.pool.name}`,
              source: 'pool',
              sourceId: poolId,
              severity: 'low',
            });
          } else {
            connection.connectionAttempts++;
          }
        } catch (error) {
          logger.error(`Reconnection failed for ${connection.pool.name}:`, error);
          connection.connectionAttempts++;
        }
      }
    }
  }

  private async pingPool(pool: MiningPool): Promise<number> {
    // Simulate network latency with realistic variation
    const baseLatency = pool.latency || 20;
    const variation = (Math.random() - 0.5) * 10; // ±5ms variation
    const networkJitter = Math.random() * 5; // Additional jitter
    
    return Math.max(5, Math.round(baseLatency + variation + networkJitter));
  }

  private async connectToPool(poolId: string): Promise<boolean> {
    const connection = this.connections.get(poolId);
    if (!connection) return false;

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate connection success/failure
      const connectionSuccess = Math.random() > 0.1; // 90% success rate
      
      if (connectionSuccess) {
        connection.isConnected = true;
        connection.connectionAttempts = 0;
        
        const workers = connection.pool.isActive ? 24 : 0;
        const latency = await this.pingPool(connection.pool);
        
        await storage.updateMiningPool(poolId, {
          status: 'connected',
          workers,
          latency,
        });
        
        logger.info(`Connected to mining pool: ${connection.pool.name}`);
        return true;
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      connection.isConnected = false;
      await storage.updateMiningPool(poolId, {
        status: 'disconnected',
        workers: 0,
      });
      
      logger.error(`Failed to connect to ${connection.pool.name}:`, error);
      return false;
    }
  }

  async switchToPool(poolId: string): Promise<void> {
    logger.info(`Switching to mining pool: ${poolId}`);

    try {
      // Disconnect from current active pool
      if (this.activePoolId && this.activePoolId !== poolId) {
        const currentConnection = this.connections.get(this.activePoolId);
        if (currentConnection) {
          currentConnection.isConnected = false;
          await storage.updateMiningPool(this.activePoolId, {
            status: 'standby',
            workers: 0,
            isActive: false,
          });
        }
      }

      // Connect to new pool
      const success = await this.connectToPool(poolId);
      if (!success) {
        throw new Error('Failed to connect to selected pool');
      }

      // Update active pool
      this.activePoolId = poolId;
      await storage.updateMiningPool(poolId, {
        isActive: true,
        workers: 24,
      });

      const connection = this.connections.get(poolId);
      await alertService.createAlert({
        type: 'success',
        title: 'Mining Pool Switched',
        message: `Now mining on ${connection?.pool.name}`,
        source: 'pool',
        sourceId: poolId,
        severity: 'low',
      });

      logger.info('Mining pool switch completed successfully');
    } catch (error) {
      logger.error('Failed to switch mining pool:', error);
      
      await alertService.createAlert({
        type: 'error',
        title: 'Pool Switch Failed',
        message: 'Failed to switch to selected mining pool',
        source: 'system',
        severity: 'high',
      });
      
      throw error;
    }
  }

  async addPool(poolData: any): Promise<MiningPool> {
    logger.info(`Adding new mining pool: ${poolData.name}`);

    try {
      const pool = await storage.createMiningPool(poolData);
      
      const connection: PoolConnection = {
        pool,
        isConnected: false,
        lastPing: new Date(),
        connectionAttempts: 0,
      };
      
      this.connections.set(pool.id, connection);
      
      // Test connection
      const connectionSuccess = await this.connectToPool(pool.id);
      
      await alertService.createAlert({
        type: connectionSuccess ? 'success' : 'warning',
        title: 'Mining Pool Added',
        message: `${pool.name} has been ${connectionSuccess ? 'added and connected' : 'added but connection failed'}`,
        source: 'pool',
        sourceId: pool.id,
        severity: 'low',
      });

      return pool;
    } catch (error) {
      logger.error('Failed to add mining pool:', error);
      throw error;
    }
  }

  async removePool(poolId: string): Promise<void> {
    const connection = this.connections.get(poolId);
    if (!connection) {
      throw new Error('Pool not found');
    }

    if (connection.pool.isActive) {
      throw new Error('Cannot remove active pool');
    }

    await storage.deleteMiningPool(poolId);
    this.connections.delete(poolId);

    await alertService.createAlert({
      type: 'info',
      title: 'Mining Pool Removed',
      message: `${connection.pool.name} has been removed`,
      source: 'system',
      severity: 'low',
    });

    logger.info(`Mining pool removed: ${connection.pool.name}`);
  }

  getPoolStatus(poolId: string): PoolConnection | undefined {
    return this.connections.get(poolId);
  }

  getActivePool(): PoolConnection | undefined {
    if (!this.activePoolId) return undefined;
    return this.connections.get(this.activePoolId);
  }

  getStatus() {
    const activePool = this.getActivePool();
    
    return {
      isInitialized: this.isInitialized,
      totalPools: this.connections.size,
      connectedPools: Array.from(this.connections.values()).filter(c => c.isConnected).length,
      activePool: activePool ? {
        name: activePool.pool.name,
        status: activePool.isConnected ? 'connected' : 'disconnected',
        workers: activePool.pool.workers,
        latency: activePool.pool.latency,
      } : null,
    };
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Mining Pool Service...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }
    
    // Disconnect from all pools
    for (const connection of this.connections.values()) {
      connection.isConnected = false;
    }
    
    this.connections.clear();
    logger.info('Mining Pool Service shut down successfully');
  }
}

export const miningPoolService = new MiningPoolService();
