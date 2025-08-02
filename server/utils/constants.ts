export const MINING_CONSTANTS = {
  // Performance metrics
  METRICS_INTERVAL: 5000, // 5 seconds
  PROCESSING_INTERVAL: 2000, // 2 seconds
  BASE_TRANSACTIONS_PER_SECOND: 1000,
  REVENUE_PER_TH: 0.00012, // BTC per TH/s per hour (approximate)
  
  // GPU thresholds
  GPU_TEMP_WARNING: 80,
  GPU_TEMP_CRITICAL: 90,
  GPU_TEMP_OPTIMAL: 65,
  GPU_UTILIZATION_LOW: 70,
  GPU_UTILIZATION_OPTIMAL: 85,
  GPU_POWER_MAX: 400,
  
  // Mining pool settings
  POOL_PING_INTERVAL: 10000, // 10 seconds
  POOL_RECONNECT_INTERVAL: 30000, // 30 seconds
  POOL_MAX_RECONNECT_ATTEMPTS: 3,
  POOL_FAILOVER_THRESHOLD: 5000, // 5 second latency threshold
  
  // Merkle tree optimization
  MERKLE_MAX_THREADS: 2048,
  MERKLE_MIN_THREADS: 128,
  MERKLE_OPTIMAL_THREADS: 512,
  MERKLE_TREE_MAX_DEPTH: 32,
  MERKLE_CACHE_SIZE: 10000,
  
  // Network settings
  WEBSOCKET_HEARTBEAT_INTERVAL: 30000, // 30 seconds
  API_TIMEOUT: 30000, // 30 seconds
  MAX_CONCURRENT_CONNECTIONS: 100,
  
  // Alert thresholds
  HASH_RATE_DROP_THRESHOLD: 0.1, // 10% drop
  EFFICIENCY_LOW_THRESHOLD: 85,
  SYSTEM_LOAD_HIGH_THRESHOLD: 90,
  MEMORY_USAGE_HIGH_THRESHOLD: 95,
  
  // Database settings
  MAX_METRICS_HISTORY_DAYS: 30,
  MAX_ALERTS_HISTORY_DAYS: 7,
  MAX_TRANSACTION_BATCHES_HISTORY_DAYS: 3,
  
  // Security settings
  MAX_LOGIN_ATTEMPTS: 5,
  SESSION_TIMEOUT: 3600000, // 1 hour
  PASSWORD_MIN_LENGTH: 8,
  
  // System resources
  MAX_CPU_USAGE: 95,
  MAX_MEMORY_USAGE: 90,
  MAX_STORAGE_USAGE: 85,
};

export const ALGORITHM_CONSTANTS = {
  // PhaseNU Algorithm parameters
  PHASE_NU_LOCK_FREE_THRESHOLD: 1000,
  PHASE_NU_BATCH_SIZE: 256,
  PHASE_NU_REDUCTION_FACTOR: 0.5,
  
  // Adaptive Restructuring parameters
  RESTRUCTURE_EFFICIENCY_THRESHOLD: 0.9,
  RESTRUCTURE_FREQUENCY_MS: 60000, // 1 minute
  RESTRUCTURE_MIN_IMPROVEMENT: 0.05, // 5% minimum improvement
  
  // Cache strategies
  LRU_CACHE_MAX_SIZE: 50000,
  LFU_CACHE_MAX_SIZE: 40000,
  ADAPTIVE_CACHE_MAX_SIZE: 60000,
  CACHE_HIT_RATE_TARGET: 0.95,
  
  // Parallel processing
  THREAD_POOL_SIZE_MULTIPLIER: 2,
  WORK_STEALING_THRESHOLD: 0.1,
  LOAD_BALANCING_INTERVAL: 5000, // 5 seconds
  
  // GPU acceleration
  CUDA_BLOCK_SIZE: 256,
  CUDA_GRID_SIZE: 1024,
  GPU_MEMORY_POOL_SIZE: 0.8, // 80% of available GPU memory
  GPU_COMPUTE_STREAMS: 4,
};

export const CRYPTOCURRENCY_CONSTANTS = {
  // Bitcoin network
  BITCOIN_BLOCK_TIME: 600000, // 10 minutes in ms
  BITCOIN_DIFFICULTY_ADJUSTMENT: 2016, // blocks
  BITCOIN_MAX_BLOCK_SIZE: 1048576, // 1MB
  BITCOIN_TRANSACTION_SIZE_AVERAGE: 250, // bytes
  
  // Ethereum network
  ETHEREUM_BLOCK_TIME: 12000, // 12 seconds in ms
  ETHEREUM_GAS_LIMIT: 30000000,
  ETHEREUM_TRANSACTION_SIZE_AVERAGE: 109, // bytes
  
  // General mining
  NONCE_RANGE: 4294967296, // 2^32
  TARGET_HASH_LEADING_ZEROS: 19, // Difficulty representation
  MERKLE_TREE_LEAF_SIZE: 32, // SHA256 hash size
};

export const ERROR_CODES = {
  // System errors
  SYSTEM_INITIALIZATION_FAILED: 'SYS_001',
  DATABASE_CONNECTION_FAILED: 'SYS_002',
  WEBSOCKET_CONNECTION_FAILED: 'SYS_003',
  CONFIGURATION_INVALID: 'SYS_004',
  
  // GPU errors
  GPU_NOT_FOUND: 'GPU_001',
  GPU_DRIVER_ERROR: 'GPU_002',
  GPU_MEMORY_ERROR: 'GPU_003',
  GPU_TEMPERATURE_CRITICAL: 'GPU_004',
  GPU_POWER_EXCEEDED: 'GPU_005',
  
  // Mining pool errors
  POOL_CONNECTION_FAILED: 'POOL_001',
  POOL_AUTHENTICATION_FAILED: 'POOL_002',
  POOL_PROTOCOL_ERROR: 'POOL_003',
  POOL_LATENCY_HIGH: 'POOL_004',
  
  // Algorithm errors
  MERKLE_TREE_CONSTRUCTION_FAILED: 'ALG_001',
  PARALLEL_PROCESSING_ERROR: 'ALG_002',
  CACHE_OVERFLOW: 'ALG_003',
  THREAD_POOL_EXHAUSTED: 'ALG_004',
  
  // Network errors
  NETWORK_TIMEOUT: 'NET_001',
  NETWORK_BANDWIDTH_EXCEEDED: 'NET_002',
  WEBSOCKET_DISCONNECTED: 'NET_003',
  API_RATE_LIMIT_EXCEEDED: 'NET_004',
  
  // Security errors
  AUTHENTICATION_FAILED: 'SEC_001',
  AUTHORIZATION_FAILED: 'SEC_002',
  SESSION_EXPIRED: 'SEC_003',
  INVALID_TOKEN: 'SEC_004',
};

export const PERFORMANCE_TARGETS = {
  // Hash rate targets
  MIN_HASH_RATE_THS: 100, // 100 TH/s minimum
  TARGET_HASH_RATE_THS: 300, // 300 TH/s target
  MAX_HASH_RATE_THS: 500, // 500 TH/s maximum expected
  
  // Efficiency targets
  MIN_EFFICIENCY: 85, // 85% minimum efficiency
  TARGET_EFFICIENCY: 95, // 95% target efficiency
  
  // Latency targets
  MAX_PROCESSING_LATENCY_MS: 100, // 100ms maximum processing latency
  TARGET_PROCESSING_LATENCY_MS: 50, // 50ms target processing latency
  
  // Throughput targets
  MIN_TRANSACTIONS_PER_SECOND: 5000,
  TARGET_TRANSACTIONS_PER_SECOND: 10000,
  MAX_TRANSACTIONS_PER_SECOND: 50000,
  
  // System resource targets
  MAX_CPU_USAGE_TARGET: 80,
  MAX_MEMORY_USAGE_TARGET: 75,
  MAX_GPU_TEMPERATURE_TARGET: 75,
};

export const MONITORING_INTERVALS = {
  REAL_TIME_UPDATE: 1000, // 1 second
  METRICS_COLLECTION: 5000, // 5 seconds
  GPU_MONITORING: 2000, // 2 seconds
  POOL_HEALTH_CHECK: 10000, // 10 seconds
  SYSTEM_HEALTH_CHECK: 30000, // 30 seconds
  ALERT_PROCESSING: 1000, // 1 second
  LOG_CLEANUP: 3600000, // 1 hour
  DATABASE_CLEANUP: 86400000, // 24 hours
};

export const API_ENDPOINTS = {
  // Dashboard
  DASHBOARD_METRICS: '/api/dashboard/metrics',
  DASHBOARD_CHART_DATA: '/api/dashboard/chart-data',
  
  // GPU management
  GPUS: '/api/gpus',
  GPU_OPTIMIZE: '/api/gpus/optimize',
  
  // Mining pools
  MINING_POOLS: '/api/mining-pools',
  POOL_ACTIVATE: '/api/mining-pools/:id/activate',
  
  // Merkle trees
  MERKLE_CONFIGS: '/api/merkle-configs',
  MERKLE_ACTIVATE: '/api/merkle-configs/:id/activate',
  
  // Analytics
  ANALYTICS_PERFORMANCE: '/api/analytics/performance',
  ANALYTICS_TRANSACTIONS: '/api/analytics/transactions',
  
  // Alerts
  ALERTS: '/api/alerts',
  ALERTS_UNREAD: '/api/alerts/unread',
  ALERT_READ: '/api/alerts/:id/read',
  
  // Configuration
  CONFIGS: '/api/configs',
  CONFIG_APPLY: '/api/configs/apply',
  
  // System
  SYSTEM_STATUS: '/api/system/status',
  
  // WebSocket
  WEBSOCKET: '/ws',
};
