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

  return httpServer;
}
