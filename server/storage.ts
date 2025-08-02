import { 
  users, gpus, miningPools, merkleTreeConfigs, systemMetrics, alerts, 
  transactionBatches, systemConfigs,
  type User, type InsertUser, type GPU, type InsertGPU, 
  type MiningPool, type InsertMiningPool, type MerkleTreeConfig, type InsertMerkleTreeConfig,
  type SystemMetric, type InsertSystemMetric, type Alert, type InsertAlert,
  type TransactionBatch, type InsertTransactionBatch, type SystemConfig, type InsertSystemConfig
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count, avg, sum } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // GPU operations
  getGPUs(): Promise<GPU[]>;
  getGPU(id: string): Promise<GPU | undefined>;
  createGPU(gpu: InsertGPU): Promise<GPU>;
  updateGPU(id: string, updates: Partial<GPU>): Promise<GPU | undefined>;
  deleteGPU(id: string): Promise<boolean>;

  // Mining Pool operations
  getMiningPools(): Promise<MiningPool[]>;
  getActiveMiningPool(): Promise<MiningPool | undefined>;
  createMiningPool(pool: InsertMiningPool): Promise<MiningPool>;
  updateMiningPool(id: string, updates: Partial<MiningPool>): Promise<MiningPool | undefined>;
  deleteMiningPool(id: string): Promise<boolean>;
  setActiveMiningPool(id: string): Promise<boolean>;

  // Merkle Tree Config operations
  getMerkleTreeConfigs(): Promise<MerkleTreeConfig[]>;
  getActiveMerkleTreeConfig(): Promise<MerkleTreeConfig | undefined>;
  createMerkleTreeConfig(config: InsertMerkleTreeConfig): Promise<MerkleTreeConfig>;
  updateMerkleTreeConfig(id: string, updates: Partial<MerkleTreeConfig>): Promise<MerkleTreeConfig | undefined>;
  setActiveMerkleTreeConfig(id: string): Promise<boolean>;

  // System Metrics operations
  getLatestSystemMetrics(): Promise<SystemMetric | undefined>;
  getSystemMetricsHistory(hours: number): Promise<SystemMetric[]>;
  createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric>;

  // Alerts operations
  getAlerts(limit?: number): Promise<Alert[]>;
  getUnreadAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: string): Promise<boolean>;
  markAlertAsResolved(id: string): Promise<boolean>;
  clearAllAlerts(): Promise<boolean>;

  // Transaction Batch operations
  getTransactionBatches(limit?: number): Promise<TransactionBatch[]>;
  createTransactionBatch(batch: InsertTransactionBatch): Promise<TransactionBatch>;
  getTransactionStats(hours: number): Promise<{
    totalProcessed: number;
    averageEfficiency: number;
    averageProcessingTime: number;
  }>;

  // System Config operations
  getSystemConfigs(): Promise<SystemConfig[]>;
  getSystemConfig(key: string): Promise<SystemConfig | undefined>;
  setSystemConfig(config: InsertSystemConfig): Promise<SystemConfig>;
  updateSystemConfig(key: string, value: any): Promise<SystemConfig | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // GPU operations
  async getGPUs(): Promise<GPU[]> {
    return await db.select().from(gpus).orderBy(gpus.name);
  }

  async getGPU(id: string): Promise<GPU | undefined> {
    const [gpu] = await db.select().from(gpus).where(eq(gpus.id, id));
    return gpu || undefined;
  }

  async createGPU(gpu: InsertGPU): Promise<GPU> {
    const [created] = await db.insert(gpus).values(gpu).returning();
    return created;
  }

  async updateGPU(id: string, updates: Partial<GPU>): Promise<GPU | undefined> {
    const [updated] = await db.update(gpus)
      .set({ ...updates, lastSeen: new Date() })
      .where(eq(gpus.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteGPU(id: string): Promise<boolean> {
    const result = await db.delete(gpus).where(eq(gpus.id, id));
    return result.rowCount > 0;
  }

  // Mining Pool operations
  async getMiningPools(): Promise<MiningPool[]> {
    return await db.select().from(miningPools).orderBy(miningPools.priority);
  }

  async getActiveMiningPool(): Promise<MiningPool | undefined> {
    const [pool] = await db.select().from(miningPools).where(eq(miningPools.isActive, true));
    return pool || undefined;
  }

  async createMiningPool(pool: InsertMiningPool): Promise<MiningPool> {
    const [created] = await db.insert(miningPools).values(pool).returning();
    return created;
  }

  async updateMiningPool(id: string, updates: Partial<MiningPool>): Promise<MiningPool | undefined> {
    const [updated] = await db.update(miningPools)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(miningPools.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteMiningPool(id: string): Promise<boolean> {
    const result = await db.delete(miningPools).where(eq(miningPools.id, id));
    return result.rowCount > 0;
  }

  async setActiveMiningPool(id: string): Promise<boolean> {
    await db.update(miningPools).set({ isActive: false });
    const [updated] = await db.update(miningPools)
      .set({ isActive: true })
      .where(eq(miningPools.id, id))
      .returning();
    return !!updated;
  }

  // Merkle Tree Config operations
  async getMerkleTreeConfigs(): Promise<MerkleTreeConfig[]> {
    return await db.select().from(merkleTreeConfigs).orderBy(desc(merkleTreeConfigs.createdAt));
  }

  async getActiveMerkleTreeConfig(): Promise<MerkleTreeConfig | undefined> {
    const [config] = await db.select().from(merkleTreeConfigs).where(eq(merkleTreeConfigs.isActive, true));
    return config || undefined;
  }

  async createMerkleTreeConfig(config: InsertMerkleTreeConfig): Promise<MerkleTreeConfig> {
    const [created] = await db.insert(merkleTreeConfigs).values(config).returning();
    return created;
  }

  async updateMerkleTreeConfig(id: string, updates: Partial<MerkleTreeConfig>): Promise<MerkleTreeConfig | undefined> {
    const [updated] = await db.update(merkleTreeConfigs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(merkleTreeConfigs.id, id))
      .returning();
    return updated || undefined;
  }

  async setActiveMerkleTreeConfig(id: string): Promise<boolean> {
    await db.update(merkleTreeConfigs).set({ isActive: false });
    const [updated] = await db.update(merkleTreeConfigs)
      .set({ isActive: true })
      .where(eq(merkleTreeConfigs.id, id))
      .returning();
    return !!updated;
  }

  // System Metrics operations
  async getLatestSystemMetrics(): Promise<SystemMetric | undefined> {
    const [metric] = await db.select().from(systemMetrics)
      .orderBy(desc(systemMetrics.timestamp))
      .limit(1);
    return metric || undefined;
  }

  async getSystemMetricsHistory(hours: number): Promise<SystemMetric[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    return await db.select().from(systemMetrics)
      .where(gte(systemMetrics.timestamp, since))
      .orderBy(systemMetrics.timestamp);
  }

  async createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric> {
    const [created] = await db.insert(systemMetrics).values(metric).returning();
    return created;
  }

  // Alerts operations
  async getAlerts(limit: number = 50): Promise<Alert[]> {
    return await db.select().from(alerts)
      .orderBy(desc(alerts.createdAt))
      .limit(limit);
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts)
      .where(eq(alerts.isRead, false))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [created] = await db.insert(alerts).values(alert).returning();
    return created;
  }

  async markAlertAsRead(id: string): Promise<boolean> {
    const [updated] = await db.update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return !!updated;
  }

  async markAlertAsResolved(id: string): Promise<boolean> {
    const [updated] = await db.update(alerts)
      .set({ isResolved: true, resolvedAt: new Date() })
      .where(eq(alerts.id, id))
      .returning();
    return !!updated;
  }

  async clearAllAlerts(): Promise<boolean> {
    const result = await db.update(alerts).set({ isRead: true });
    return result.rowCount > 0;
  }

  // Transaction Batch operations
  async getTransactionBatches(limit: number = 100): Promise<TransactionBatch[]> {
    return await db.select().from(transactionBatches)
      .orderBy(desc(transactionBatches.createdAt))
      .limit(limit);
  }

  async createTransactionBatch(batch: InsertTransactionBatch): Promise<TransactionBatch> {
    const [created] = await db.insert(transactionBatches).values(batch).returning();
    return created;
  }

  async getTransactionStats(hours: number): Promise<{
    totalProcessed: number;
    averageEfficiency: number;
    averageProcessingTime: number;
  }> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const [stats] = await db.select({
      totalProcessed: sum(transactionBatches.batchSize),
      averageEfficiency: avg(transactionBatches.efficiency),
      averageProcessingTime: avg(transactionBatches.processingTime),
    }).from(transactionBatches)
      .where(gte(transactionBatches.createdAt, since));

    return {
      totalProcessed: Number(stats.totalProcessed) || 0,
      averageEfficiency: Number(stats.averageEfficiency) || 0,
      averageProcessingTime: Number(stats.averageProcessingTime) || 0,
    };
  }

  // System Config operations
  async getSystemConfigs(): Promise<SystemConfig[]> {
    return await db.select().from(systemConfigs).orderBy(systemConfigs.category, systemConfigs.key);
  }

  async getSystemConfig(key: string): Promise<SystemConfig | undefined> {
    const [config] = await db.select().from(systemConfigs).where(eq(systemConfigs.key, key));
    return config || undefined;
  }

  async setSystemConfig(config: InsertSystemConfig): Promise<SystemConfig> {
    const [created] = await db.insert(systemConfigs)
      .values(config)
      .onConflictDoUpdate({
        target: systemConfigs.key,
        set: { value: config.value, updatedAt: new Date() }
      })
      .returning();
    return created;
  }

  async updateSystemConfig(key: string, value: any): Promise<SystemConfig | undefined> {
    const [updated] = await db.update(systemConfigs)
      .set({ value, updatedAt: new Date() })
      .where(eq(systemConfigs.key, key))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
