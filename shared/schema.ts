import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb, uuid, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gpus = pgTable("gpus", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  model: text("model").notNull(),
  hashRate: real("hash_rate").notNull().default(0),
  temperature: integer("temperature").notNull().default(0),
  power: integer("power").notNull().default(0),
  memoryUsed: real("memory_used").notNull().default(0),
  memoryTotal: real("memory_total").notNull().default(0),
  utilizationRate: real("utilization_rate").notNull().default(0),
  status: text("status").notNull().default("offline"),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningPools = pgTable("mining_pools", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  port: integer("port").notNull(),
  username: text("username").notNull(),
  password: text("password"),
  difficulty: bigint("difficulty", { mode: "number" }),
  latency: integer("latency").default(0),
  status: text("status").notNull().default("disconnected"),
  isActive: boolean("is_active").default(false),
  priority: integer("priority").default(1),
  workers: integer("workers").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const merkleTreeConfigs = pgTable("merkle_tree_configs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  parallelThreads: integer("parallel_threads").notNull().default(512),
  treeDepth: text("tree_depth").notNull().default("auto"),
  cacheStrategy: text("cache_strategy").notNull().default("adaptive"),
  isActive: boolean("is_active").default(false),
  performance: jsonb("performance"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").defaultNow(),
  totalHashRate: real("total_hash_rate").notNull(),
  treeEfficiency: real("tree_efficiency").notNull(),
  activeGPUs: integer("active_gpus").notNull(),
  dailyRevenue: real("daily_revenue").notNull(),
  cpuUsage: real("cpu_usage").notNull(),
  memoryUsage: real("memory_usage").notNull(),
  storageUsage: real("storage_usage").notNull(),
  networkLoad: real("network_load").notNull(),
  transactionsProcessed: bigint("transactions_processed", { mode: "number" }).notNull(),
  transactionsPending: bigint("transactions_pending", { mode: "number" }).notNull(),
});

export const alerts = pgTable("alerts", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // warning, info, success, error
  title: text("title").notNull(),
  message: text("message").notNull(),
  source: text("source"), // gpu, pool, system, algorithm
  sourceId: uuid("source_id"),
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const transactionBatches = pgTable("transaction_batches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  batchSize: integer("batch_size").notNull(),
  processingTime: real("processing_time").notNull(),
  merkleRoot: text("merkle_root").notNull(),
  algorithm: text("algorithm").notNull(),
  networkType: text("network_type").notNull(), // bitcoin, ethereum, etc
  efficiency: real("efficiency").notNull(),
  gpuIds: jsonb("gpu_ids"), // array of GPU IDs used
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemConfigs = pgTable("system_configs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").notNull(), // algorithm, hardware, network
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const gpuRelations = relations(gpus, ({ many }) => ({
  alerts: many(alerts),
}));

export const miningPoolRelations = relations(miningPools, ({ many }) => ({
  alerts: many(alerts),
}));

export const alertRelations = relations(alerts, ({ one }) => ({
  gpu: one(gpus, {
    fields: [alerts.sourceId],
    references: [gpus.id],
  }),
  miningPool: one(miningPools, {
    fields: [alerts.sourceId],
    references: [miningPools.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGPUSchema = createInsertSchema(gpus).omit({
  id: true,
  createdAt: true,
  lastSeen: true,
});

export const insertMiningPoolSchema = createInsertSchema(miningPools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMerkleTreeConfigSchema = createInsertSchema(merkleTreeConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertTransactionBatchSchema = createInsertSchema(transactionBatches).omit({
  id: true,
  createdAt: true,
});

export const insertSystemConfigSchema = createInsertSchema(systemConfigs).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type GPU = typeof gpus.$inferSelect;
export type InsertGPU = z.infer<typeof insertGPUSchema>;

export type MiningPool = typeof miningPools.$inferSelect;
export type InsertMiningPool = z.infer<typeof insertMiningPoolSchema>;

export type MerkleTreeConfig = typeof merkleTreeConfigs.$inferSelect;
export type InsertMerkleTreeConfig = z.infer<typeof insertMerkleTreeConfigSchema>;

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type TransactionBatch = typeof transactionBatches.$inferSelect;
export type InsertTransactionBatch = z.infer<typeof insertTransactionBatchSchema>;

export type SystemConfig = typeof systemConfigs.$inferSelect;
export type InsertSystemConfig = z.infer<typeof insertSystemConfigSchema>;
