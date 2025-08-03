import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { miningEngine } from "./services/miningEngine";
import { gpuManager } from "./services/gpuManager";
import { merkleTreeService } from "./services/merkleTreeService";
import { miningPoolService } from "./services/miningPoolService";
import { analyticsService } from "./services/analyticsService";
import { alertService } from "./services/alertService";
import { configService } from "./services/configService";
import { adaptiveOptimizer } from "./services/adaptiveOptimizer";
import { quantumResistantCrypto } from "./services/quantumResistantCrypto";
import { clusterManager } from "./services/clusterManager";
import { miningPoolIntegration } from "./services/miningPoolIntegration";
import { validateRequest } from "./middleware/validation";
import { 
  insertGPUSchema, insertMiningPoolSchema, insertMerkleTreeConfigSchema,
  insertAlertSchema, insertSystemConfigSchema 
} from "@shared/schema";
import { logger } from "./utils/logger";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const connectedClients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    logger.info('WebSocket client connected');
    connectedClients.add(ws);

    ws.on('close', () => {
      logger.info('WebSocket client disconnected');
      connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (event: string, data: any) => {
    const message = JSON.stringify({ event, data, timestamp: new Date().toISOString() });
    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  // Initialize services with broadcast capability
  miningEngine.setBroadcast(broadcast);
  gpuManager.setBroadcast(broadcast);
  alertService.setBroadcast(broadcast);
  adaptiveOptimizer.setBroadcast(broadcast);
  quantumResistantCrypto.setBroadcast(broadcast);
  clusterManager.setBroadcast(broadcast);
  miningPoolIntegration.setBroadcast(broadcast);

  // Start background services
  await miningEngine.initialize();
  await gpuManager.initialize();
  await miningPoolService.initialize();
  await analyticsService.initialize();
  
  // Initialize advanced services
  await adaptiveOptimizer.initialize();
  await quantumResistantCrypto.initialize();
  await clusterManager.initialize();
  await miningPoolIntegration.initialize();

  // API Routes

  // Dashboard endpoints
  app.get('/api/dashboard/metrics', async (req, res) => {
    try {
      const metrics = await analyticsService.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      logger.error('Error fetching dashboard metrics:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
  });

  app.get('/api/dashboard/chart-data/:period', async (req, res) => {
    try {
      const { period } = req.params;
      const hours = period === '24h' ? 24 : period === '7d' ? 168 : 720; // 24h, 7d, 30d
      const chartData = await analyticsService.getChartData(hours);
      res.json(chartData);
    } catch (error) {
      logger.error('Error fetching chart data:', error);
      res.status(500).json({ error: 'Failed to fetch chart data' });
    }
  });

  // GPU management endpoints
  app.get('/api/gpus', async (req, res) => {
    try {
      const gpus = await storage.getGPUs();
      res.json(gpus);
    } catch (error) {
      logger.error('Error fetching GPUs:', error);
      res.status(500).json({ error: 'Failed to fetch GPUs' });
    }
  });

  app.post('/api/gpus', validateRequest(insertGPUSchema), async (req, res) => {
    try {
      const gpu = await storage.createGPU(req.body);
      broadcast('gpu_added', gpu);
      res.status(201).json(gpu);
    } catch (error) {
      logger.error('Error creating GPU:', error);
      res.status(500).json({ error: 'Failed to create GPU' });
    }
  });

  app.put('/api/gpus/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const gpu = await storage.updateGPU(id, req.body);
      if (!gpu) {
        return res.status(404).json({ error: 'GPU not found' });
      }
      broadcast('gpu_updated', gpu);
      res.json(gpu);
    } catch (error) {
      logger.error('Error updating GPU:', error);
      res.status(500).json({ error: 'Failed to update GPU' });
    }
  });

  app.delete('/api/gpus/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteGPU(id);
      if (!success) {
        return res.status(404).json({ error: 'GPU not found' });
      }
      broadcast('gpu_deleted', { id });
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting GPU:', error);
      res.status(500).json({ error: 'Failed to delete GPU' });
    }
  });

  app.post('/api/gpus/optimize', async (req, res) => {
    try {
      await gpuManager.optimizeAll();
      res.json({ message: 'GPU optimization started' });
    } catch (error) {
      logger.error('Error optimizing GPUs:', error);
      res.status(500).json({ error: 'Failed to optimize GPUs' });
    }
  });

  // Mining pool endpoints
  app.get('/api/mining-pools', async (req, res) => {
    try {
      const pools = await storage.getMiningPools();
      res.json(pools);
    } catch (error) {
      logger.error('Error fetching mining pools:', error);
      res.status(500).json({ error: 'Failed to fetch mining pools' });
    }
  });

  app.post('/api/mining-pools', validateRequest(insertMiningPoolSchema), async (req, res) => {
    try {
      const pool = await storage.createMiningPool(req.body);
      broadcast('pool_added', pool);
      res.status(201).json(pool);
    } catch (error) {
      logger.error('Error creating mining pool:', error);
      res.status(500).json({ error: 'Failed to create mining pool' });
    }
  });

  app.put('/api/mining-pools/:id/activate', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.setActiveMiningPool(id);
      if (!success) {
        return res.status(404).json({ error: 'Mining pool not found' });
      }
      await miningPoolService.switchToPool(id);
      broadcast('active_pool_changed', { id });
      res.json({ message: 'Mining pool activated' });
    } catch (error) {
      logger.error('Error activating mining pool:', error);
      res.status(500).json({ error: 'Failed to activate mining pool' });
    }
  });

  // Merkle tree configuration endpoints
  app.get('/api/merkle-configs', async (req, res) => {
    try {
      const configs = await storage.getMerkleTreeConfigs();
      res.json(configs);
    } catch (error) {
      logger.error('Error fetching merkle configs:', error);
      res.status(500).json({ error: 'Failed to fetch merkle configs' });
    }
  });

  app.post('/api/merkle-configs', validateRequest(insertMerkleTreeConfigSchema), async (req, res) => {
    try {
      const config = await storage.createMerkleTreeConfig(req.body);
      res.status(201).json(config);
    } catch (error) {
      logger.error('Error creating merkle config:', error);
      res.status(500).json({ error: 'Failed to create merkle config' });
    }
  });

  app.put('/api/merkle-configs/:id/activate', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.setActiveMerkleTreeConfig(id);
      if (!success) {
        return res.status(404).json({ error: 'Merkle config not found' });
      }
      await merkleTreeService.applyConfiguration(id);
      broadcast('merkle_config_changed', { id });
      res.json({ message: 'Merkle configuration activated' });
    } catch (error) {
      logger.error('Error activating merkle config:', error);
      res.status(500).json({ error: 'Failed to activate merkle config' });
    }
  });

  // Analytics endpoints
  app.get('/api/analytics/performance/:hours', async (req, res) => {
    try {
      const hours = parseInt(req.params.hours) || 24;
      const performance = await analyticsService.getPerformanceAnalytics(hours);
      res.json(performance);
    } catch (error) {
      logger.error('Error fetching performance analytics:', error);
      res.status(500).json({ error: 'Failed to fetch performance analytics' });
    }
  });

  app.get('/api/analytics/transactions/:hours', async (req, res) => {
    try {
      const hours = parseInt(req.params.hours) || 24;
      const stats = await storage.getTransactionStats(hours);
      res.json(stats);
    } catch (error) {
      logger.error('Error fetching transaction stats:', error);
      res.status(500).json({ error: 'Failed to fetch transaction stats' });
    }
  });

  // Alerts endpoints
  app.get('/api/alerts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const alerts = await storage.getAlerts(limit);
      res.json(alerts);
    } catch (error) {
      logger.error('Error fetching alerts:', error);
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });

  app.get('/api/alerts/unread', async (req, res) => {
    try {
      const alerts = await storage.getUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      logger.error('Error fetching unread alerts:', error);
      res.status(500).json({ error: 'Failed to fetch unread alerts' });
    }
  });

  app.post('/api/alerts', validateRequest(insertAlertSchema), async (req, res) => {
    try {
      const alert = await storage.createAlert(req.body);
      broadcast('new_alert', alert);
      res.status(201).json(alert);
    } catch (error) {
      logger.error('Error creating alert:', error);
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });

  app.put('/api/alerts/:id/read', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markAlertAsRead(id);
      if (!success) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      broadcast('alert_read', { id });
      res.json({ message: 'Alert marked as read' });
    } catch (error) {
      logger.error('Error marking alert as read:', error);
      res.status(500).json({ error: 'Failed to mark alert as read' });
    }
  });

  app.delete('/api/alerts', async (req, res) => {
    try {
      await storage.clearAllAlerts();
      broadcast('alerts_cleared', {});
      res.json({ message: 'All alerts cleared' });
    } catch (error) {
      logger.error('Error clearing alerts:', error);
      res.status(500).json({ error: 'Failed to clear alerts' });
    }
  });

  // System configuration endpoints
  app.get('/api/configs', async (req, res) => {
    try {
      const configs = await storage.getSystemConfigs();
      res.json(configs);
    } catch (error) {
      logger.error('Error fetching system configs:', error);
      res.status(500).json({ error: 'Failed to fetch system configs' });
    }
  });

  app.put('/api/configs/:key', async (req, res) => {
    try {
      const { key } = req.params;
      const { value } = req.body;
      const config = await storage.updateSystemConfig(key, value);
      if (!config) {
        return res.status(404).json({ error: 'Configuration not found' });
      }
      await configService.applyConfiguration(key, value);
      broadcast('config_updated', config);
      res.json(config);
    } catch (error) {
      logger.error('Error updating system config:', error);
      res.status(500).json({ error: 'Failed to update system config' });
    }
  });

  app.post('/api/configs/apply', async (req, res) => {
    try {
      const configs = req.body;
      await configService.applyBulkConfiguration(configs);
      broadcast('bulk_config_applied', configs);
      res.json({ message: 'Configuration applied successfully' });
    } catch (error) {
      logger.error('Error applying configuration:', error);
      res.status(500).json({ error: 'Failed to apply configuration' });
    }
  });

  // System status endpoint
  app.get('/api/system/status', async (req, res) => {
    try {
      const status = {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        activeConnections: connectedClients.size,
        services: {
          miningEngine: miningEngine.getStatus(),
          gpuManager: gpuManager.getStatus(),
          miningPools: miningPoolService.getStatus(),
          analytics: analyticsService.getStatus(),
        }
      };
      res.json(status);
    } catch (error) {
      logger.error('Error fetching system status:', error);
      res.status(500).json({ error: 'Failed to fetch system status' });
    }
  });

  // AI/ML Optimization endpoints
  app.get('/api/ai/optimization-status', async (req, res) => {
    try {
      const status = await adaptiveOptimizer.getOptimizationStatus();
      res.json(status);
    } catch (error) {
      logger.error('Error fetching optimization status:', error);
      res.status(500).json({ error: 'Failed to fetch optimization status' });
    }
  });

  app.get('/api/ai/performance-prediction/:hours', async (req, res) => {
    try {
      const hours = parseInt(req.params.hours);
      const prediction = await adaptiveOptimizer.getPerformancePrediction(hours);
      res.json(prediction);
    } catch (error) {
      logger.error('Error fetching performance prediction:', error);
      res.status(500).json({ error: 'Failed to fetch performance prediction' });
    }
  });

  // Quantum Security endpoints
  app.get('/api/quantum/security-assessment', async (req, res) => {
    try {
      const assessment = await quantumResistantCrypto.generateSecurityAssessment();
      res.json(assessment);
    } catch (error) {
      logger.error('Error generating security assessment:', error);
      res.status(500).json({ error: 'Failed to generate security assessment' });
    }
  });

  // Cluster Management endpoints
  app.get('/api/cluster/status', async (req, res) => {
    try {
      const status = await clusterManager.getClusterStatus();
      res.json(status);
    } catch (error) {
      logger.error('Error fetching cluster status:', error);
      res.status(500).json({ error: 'Failed to fetch cluster status' });
    }
  });

  // Mining Pool Integration endpoints
  app.get('/api/pools/integration-status', async (req, res) => {
    try {
      const status = await miningPoolIntegration.getIntegrationStatus();
      res.json(status);
    } catch (error) {
      logger.error('Error fetching pool integration status:', error);
      res.status(500).json({ error: 'Failed to fetch pool integration status' });
    }
  });

  const port = Number(process.env.PORT) || 5000;
  httpServer.listen(port, '0.0.0.0', () => {
    logger.info(`serving on port ${port}`);
  });

  // Serve individual SVG images - simplified without complex services
  app.get('/api/images/:imageName', (req, res) => {
    const { imageName } = req.params;
    
    const generateSimpleSVG = (type: string) => {
      const baseStyle = `
        <style>
          .bg { fill: #0F172A; }
          .card { fill: #374151; }
          .text-white { fill: white; font-family: Arial, sans-serif; }
          .text-gray { fill: #9CA3AF; font-family: Arial, sans-serif; }
          .text-green { fill: #10B981; font-family: Arial, sans-serif; }
          .accent { fill: #10B981; }
        </style>
      `;
      
      switch (type) {
        case 'dashboard':
          return `<svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
            ${baseStyle}
            <rect width="800" height="400" class="bg"/>
            <rect x="0" y="0" width="800" height="60" fill="#1F2937"/>
            <text x="20" y="35" class="text-white" font-size="18" font-weight="bold">🚀 CryptoTree Mining Dashboard</text>
            <circle cx="750" cy="30" r="8" class="accent"/>
            <text x="720" y="35" class="text-green" font-size="12">LIVE</text>
            
            <rect x="20" y="80" width="180" height="120" rx="8" class="card"/>
            <text x="30" y="105" class="text-gray" font-size="12">Hash Rate</text>
            <text x="30" y="130" class="text-white" font-size="24" font-weight="bold">65.6 TH/s</text>
            <text x="30" y="150" class="text-green" font-size="12">+8.2% ↗</text>
            
            <rect x="220" y="80" width="180" height="120" rx="8" class="card"/>
            <text x="230" y="105" class="text-gray" font-size="12">System Uptime</text>
            <text x="230" y="130" class="text-white" font-size="24" font-weight="bold">98.7%</text>
            <text x="230" y="150" class="text-green" font-size="12">Excellent</text>
            
            <rect x="420" y="80" width="180" height="120" rx="8" class="card"/>
            <text x="430" y="105" class="text-gray" font-size="12">Cache Efficiency</text>
            <text x="430" y="130" class="text-white" font-size="24" font-weight="bold">96.2%</text>
            <text x="430" y="150" class="text-green" font-size="12">Optimized</text>
            
            <rect x="620" y="80" width="160" height="120" rx="8" class="card"/>
            <text x="630" y="105" class="text-gray" font-size="12">Daily Revenue</text>
            <text x="630" y="130" class="text-white" font-size="24" font-weight="bold">$0.11</text>
            <text x="630" y="150" class="text-green" font-size="12">Earning</text>
            
            <rect x="20" y="220" width="760" height="160" rx="8" class="card"/>
            <text x="30" y="245" class="text-gray" font-size="14">System Performance (24H)</text>
            <polyline points="40,350 120,330 200,320 280,310 360,300 440,295 520,305 600,290 680,280 760,270"
                      stroke="#10B981" stroke-width="2" fill="none"/>
                      
            <circle cx="50" cy="385" r="3" class="accent"/>
            <text x="60" y="390" class="text-green" font-size="10">All Systems Operational</text>
          </svg>`;
          
        case 'gpu-management':
          return `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
            ${baseStyle}
            <rect width="800" height="500" class="bg"/>
            <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
            <text x="20" y="30" class="text-white" font-size="16" font-weight="bold">🔧 GPU Management Interface</text>
            
            <rect x="20" y="70" width="360" height="120" rx="8" class="card"/>
            <text x="30" y="95" class="text-white" font-size="14" font-weight="bold">RTX 3090 #1</text>
            <text x="30" y="115" class="text-green" font-size="12">8.7 TH/s • 86°C • 367W</text>
            <circle cx="320" cy="130" r="30" stroke="#F59E0B" stroke-width="4" fill="none"/>
            <text x="312" y="135" class="text-white" font-size="12">86°C</text>
            
            <rect x="400" y="70" width="360" height="120" rx="8" class="card"/>
            <text x="410" y="95" class="text-white" font-size="14" font-weight="bold">RTX 4080 Series</text>
            <text x="410" y="115" class="text-green" font-size="12">23.0 TH/s • 65°C • 320W</text>
            <circle cx="700" cy="130" r="30" stroke="#10B981" stroke-width="4" fill="none"/>
            <text x="692" y="135" class="text-white" font-size="12">65°C</text>
            
            <rect x="20" y="210" width="360" height="120" rx="8" class="card"/>
            <text x="30" y="235" class="text-white" font-size="14" font-weight="bold">RTX 4090 #1</text>
            <text x="30" y="255" class="text-green" font-size="12">14.2 TH/s • 59°C • 311W</text>
            <text x="30" y="275" fill="#F59E0B" font-size="10">⭐ Peak Performance</text>
            
            <rect x="400" y="210" width="360" height="120" rx="8" class="card"/>
            <text x="410" y="235" class="text-white" font-size="14" font-weight="bold">Fleet Overview</text>
            <text x="410" y="255" class="text-gray" font-size="12">Total Hash Rate: 65.6 TH/s</text>
            <text x="410" y="275" class="text-gray" font-size="12">Total Power: 1,831W</text>
            <text x="410" y="295" class="text-gray" font-size="12">Status: All Online</text>
            <circle cx="570" cy="292" r="4" class="accent"/>
            
            <rect x="20" y="350" width="740" height="130" rx="8" class="card"/>
            <text x="30" y="375" class="text-white" font-size="14" font-weight="bold">Hash Rate Performance (24H)</text>
            <polyline points="60,450 120,440 180,435 240,445 300,430 360,425 420,430 480,425 540,420 600,415 660,410 720,405"
                      stroke="#10B981" stroke-width="3" fill="none"/>
          </svg>`;
          
        case 'mining-pools':
          return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
            ${baseStyle}
            <rect width="800" height="450" class="bg"/>
            <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
            <text x="20" y="30" class="text-white" font-size="16" font-weight="bold">⛏️ Mining Pool Management</text>
            <text x="650" y="30" class="text-green" font-size="12">14/17 Connected</text>
            
            <rect x="20" y="70" width="760" height="60" rx="8" class="card"/>
            <circle cx="40" cy="100" r="8" class="accent"/>
            <text x="60" y="90" class="text-white" font-size="14" font-weight="bold">Binance Pool</text>
            <text x="60" y="105" class="text-gray" font-size="12">stratum+tcp://stratum.binance.pool.com:8888</text>
            <text x="60" y="120" class="text-green" font-size="12">PRIMARY • 176ms latency • 0 workers</text>
            
            <rect x="600" y="85" width="80" height="30" rx="4" class="accent"/>
            <text x="625" y="105" class="text-white" font-size="12">ACTIVE</text>
            
            <rect x="20" y="150" width="240" height="80" rx="8" class="card"/>
            <circle cx="35" cy="170" r="6" class="accent"/>
            <text x="50" y="175" class="text-white" font-size="12" font-weight="bold">F2Pool</text>
            <text x="50" y="190" class="text-gray" font-size="10">154ms • Connected</text>
            <text x="50" y="205" class="text-green" font-size="10">12 workers</text>
            
            <rect x="280" y="150" width="240" height="80" rx="8" class="card"/>
            <circle cx="295" cy="170" r="6" class="accent"/>
            <text x="310" y="175" class="text-white" font-size="12" font-weight="bold">AntPool</text>
            <text x="310" y="190" class="text-gray" font-size="10">142ms • Connected</text>
            
            <rect x="540" y="150" width="240" height="80" rx="8" class="card"/>
            <circle cx="555" cy="170" r="6" class="accent"/>
            <text x="570" y="175" class="text-white" font-size="12" font-weight="bold">Poolin</text>
            <text x="570" y="190" class="text-gray" font-size="10">198ms • Connected</text>
            
            <rect x="20" y="350" width="760" height="80" rx="8" class="card"/>
            <text x="30" y="375" class="text-white" font-size="14" font-weight="bold">Pool Statistics</text>
            <text x="30" y="395" class="text-gray" font-size="12">Average Latency: 124ms</text>
            <text x="250" y="395" class="text-gray" font-size="12">Active Workers: 72 distributed</text>
            <text x="500" y="395" class="text-gray" font-size="12">Connection Health: Excellent</text>
          </svg>`;
          
        case 'analytics':
          return `<svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
            ${baseStyle}
            <rect width="800" height="500" class="bg"/>
            <rect x="0" y="0" width="800" height="50" fill="#1F2937"/>
            <text x="20" y="30" class="text-white" font-size="16" font-weight="bold">📊 Performance Analytics</text>
            
            <rect x="20" y="70" width="180" height="100" rx="8" class="card"/>
            <text x="30" y="95" class="text-gray" font-size="12">Peak Performance</text>
            <text x="30" y="120" class="text-white" font-size="20" font-weight="bold">358.2 TH/s</text>
            <text x="30" y="140" class="text-green" font-size="12">🏆 Record High</text>
            
            <rect x="220" y="70" width="180" height="100" rx="8" class="card"/>
            <text x="230" y="95" class="text-gray" font-size="12">Average Hash Rate</text>
            <text x="230" y="120" class="text-white" font-size="20" font-weight="bold">342.5 TH/s</text>
            <text x="230" y="140" class="text-green" font-size="12">+8.2% improvement</text>
            
            <rect x="420" y="70" width="180" height="100" rx="8" class="card"/>
            <text x="430" y="95" class="text-gray" font-size="12">Revenue Trend</text>
            <text x="430" y="120" class="text-white" font-size="20" font-weight="bold">$3.30</text>
            <text x="430" y="140" class="text-green" font-size="12">Monthly total</text>
            
            <rect x="620" y="70" width="160" height="100" rx="8" class="card"/>
            <text x="630" y="95" class="text-gray" font-size="12">Efficiency</text>
            <text x="630" y="120" class="text-white" font-size="20" font-weight="bold">98.7%</text>
            <text x="630" y="140" class="text-green" font-size="12">Uptime</text>
            
            <rect x="20" y="190" width="760" height="200" rx="8" class="card"/>
            <text x="30" y="215" class="text-white" font-size="14" font-weight="bold">Hash Rate History (7 Days)</text>
            
            <polygon points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250 760,370 60,370"
                     fill="#10B981" fill-opacity="0.2"/>
            
            <polyline points="60,360 160,340 260,320 360,300 460,285 560,275 660,260 760,250"
                      stroke="#10B981" stroke-width="3" fill="none"/>
            
            <circle cx="760" cy="250" r="4" fill="#F59E0B"/>
            
            <rect x="20" y="410" width="760" height="70" rx="8" class="card"/>
            <text x="30" y="435" class="text-white" font-size="14" font-weight="bold">ML Optimization Status</text>
            <text x="30" y="455" class="text-green" font-size="12">✓ PhaseNU Algorithm: 94.2% efficiency</text>
            <text x="30" y="470" class="text-green" font-size="12">✓ Adaptive Restructuring: 91.8% active</text>
          </svg>`;
          
        default:
          return `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
            ${baseStyle}
            <rect width="400" height="200" class="bg"/>
            <text x="200" y="100" class="text-white" font-size="16" text-anchor="middle">Image not found</text>
          </svg>`;
      }
    };
    
    const svgContent = generateSimpleSVG(imageName);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(svgContent);
  });

  return httpServer;
}
