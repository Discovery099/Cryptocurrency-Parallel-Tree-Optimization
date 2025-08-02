import { storage } from "../storage";
import { logger } from "../utils/logger";

interface ClusterNode {
  id: string;
  hostname: string;
  ipAddress: string;
  port: number;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  healthScore: number;
  capabilities: {
    cpuCores: number;
    memoryGB: number;
    gpuCount: number;
    networkBandwidth: number;
  };
  workload: {
    currentTasks: number;
    maxTasks: number;
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage: number;
  };
  performance: {
    hashRate: number;
    efficiency: number;
    uptime: number;
    lastSeen: Date;
  };
  location: {
    region: string;
    datacenter: string;
    rack?: string;
  };
}

interface LoadBalancingStrategy {
  name: string;
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'adaptive_ai';
  weights?: Record<string, number>;
  parameters?: Record<string, any>;
}

interface FailoverStrategy {
  name: string;
  type: 'active_passive' | 'active_active' | 'n_plus_1';
  priority: Record<string, number>;
  healthThreshold: number;
  failoverTime: number;
}

class ClusterManager {
  private isInitialized = false;
  private nodes: Map<string, ClusterNode> = new Map();
  private broadcast?: (event: string, data: any) => void;
  private monitoringInterval?: NodeJS.Timeout;
  private discoveryInterval?: NodeJS.Timeout;
  private loadBalancingStrategy: LoadBalancingStrategy;
  private failoverStrategy: FailoverStrategy;

  constructor() {
    this.loadBalancingStrategy = {
      name: 'AI-Adaptive Load Balancing',
      algorithm: 'adaptive_ai',
      parameters: {
        learningRate: 0.1,
        adaptationInterval: 300, // 5 minutes
      },
    };

    this.failoverStrategy = {
      name: 'N+1 Redundancy',
      type: 'n_plus_1',
      priority: {},
      healthThreshold: 70,
      failoverTime: 30, // seconds
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Distributed Cluster Manager...');

    try {
      // Start node discovery
      await this.startNodeDiscovery();
      
      // Initialize monitoring
      this.startHealthMonitoring();
      
      // Setup initial cluster configuration
      await this.setupInitialCluster();
      
      this.isInitialized = true;
      logger.info('Distributed Cluster Manager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Distributed Cluster Manager:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private async startNodeDiscovery(): Promise<void> {
    // Simulate node discovery - in production, this would use service discovery
    const simulatedNodes: Omit<ClusterNode, 'id'>[] = [
      {
        hostname: 'mining-node-001',
        ipAddress: '192.168.1.10',
        port: 8080,
        status: 'online',
        healthScore: 95,
        capabilities: {
          cpuCores: 32,
          memoryGB: 128,
          gpuCount: 8,
          networkBandwidth: 10000,
        },
        workload: {
          currentTasks: 12,
          maxTasks: 20,
          cpuUsage: 65,
          memoryUsage: 70,
          gpuUsage: 85,
        },
        performance: {
          hashRate: 150.5,
          efficiency: 92.3,
          uptime: 99.8,
          lastSeen: new Date(),
        },
        location: {
          region: 'us-west-2',
          datacenter: 'DC1',
          rack: 'R01',
        },
      },
      {
        hostname: 'mining-node-002',
        ipAddress: '192.168.1.11',
        port: 8080,
        status: 'online',
        healthScore: 88,
        capabilities: {
          cpuCores: 24,
          memoryGB: 96,
          gpuCount: 6,
          networkBandwidth: 10000,
        },
        workload: {
          currentTasks: 8,
          maxTasks: 15,
          cpuUsage: 55,
          memoryUsage: 60,
          gpuUsage: 75,
        },
        performance: {
          hashRate: 112.8,
          efficiency: 89.1,
          uptime: 98.5,
          lastSeen: new Date(),
        },
        location: {
          region: 'us-west-2',
          datacenter: 'DC1',
          rack: 'R02',
        },
      },
      {
        hostname: 'mining-node-003',
        ipAddress: '192.168.1.12',
        port: 8080,
        status: 'degraded',
        healthScore: 72,
        capabilities: {
          cpuCores: 16,
          memoryGB: 64,
          gpuCount: 4,
          networkBandwidth: 5000,
        },
        workload: {
          currentTasks: 6,
          maxTasks: 10,
          cpuUsage: 80,
          memoryUsage: 85,
          gpuUsage: 90,
        },
        performance: {
          hashRate: 68.2,
          efficiency: 76.5,
          uptime: 95.2,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        },
        location: {
          region: 'us-east-1',
          datacenter: 'DC2',
          rack: 'R01',
        },
      },
    ];

    for (const nodeData of simulatedNodes) {
      const nodeId = this.generateNodeId(nodeData.hostname);
      const node: ClusterNode = {
        id: nodeId,
        ...nodeData,
      };
      this.nodes.set(nodeId, node);
    }

    logger.info(`Discovered ${this.nodes.size} cluster nodes`);

    // Start periodic discovery for new nodes
    this.discoveryInterval = setInterval(async () => {
      await this.discoverNewNodes();
    }, 60000); // Every minute
  }

  private generateNodeId(hostname: string): string {
    return `node-${hostname.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
  }

  private async discoverNewNodes(): Promise<void> {
    // In production, this would scan the network for new mining nodes
    // For now, we'll simulate occasional node additions
    if (Math.random() < 0.1 && this.nodes.size < 10) { // 10% chance, max 10 nodes
      const newNode: ClusterNode = {
        id: this.generateNodeId(`mining-node-${String(this.nodes.size + 1).padStart(3, '0')}`),
        hostname: `mining-node-${String(this.nodes.size + 1).padStart(3, '0')}`,
        ipAddress: `192.168.1.${20 + this.nodes.size}`,
        port: 8080,
        status: 'online',
        healthScore: 80 + Math.random() * 20,
        capabilities: {
          cpuCores: 16 + Math.floor(Math.random() * 32),
          memoryGB: 32 + Math.floor(Math.random() * 128),
          gpuCount: 2 + Math.floor(Math.random() * 8),
          networkBandwidth: 1000 + Math.floor(Math.random() * 10000),
        },
        workload: {
          currentTasks: Math.floor(Math.random() * 10),
          maxTasks: 10 + Math.floor(Math.random() * 20),
          cpuUsage: 30 + Math.random() * 50,
          memoryUsage: 40 + Math.random() * 40,
          gpuUsage: 50 + Math.random() * 40,
        },
        performance: {
          hashRate: 50 + Math.random() * 100,
          efficiency: 70 + Math.random() * 25,
          uptime: 95 + Math.random() * 5,
          lastSeen: new Date(),
        },
        location: {
          region: Math.random() > 0.5 ? 'us-west-2' : 'us-east-1',
          datacenter: Math.random() > 0.5 ? 'DC1' : 'DC2',
          rack: `R${String(Math.floor(Math.random() * 5) + 1).padStart(2, '0')}`,
        },
      };

      this.nodes.set(newNode.id, newNode);
      logger.info(`Discovered new cluster node: ${newNode.hostname}`);

      if (this.broadcast) {
        this.broadcast('node_discovered', newNode);
      }
    }
  }

  private startHealthMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthChecks();
      await this.updateLoadBalancing();
      await this.checkFailoverConditions();
    }, 30000); // Every 30 seconds
  }

  private async performHealthChecks(): Promise<void> {
    const now = new Date();
    
    for (const [nodeId, node] of this.nodes.entries()) {
      // Simulate health check
      const timeSinceLastSeen = now.getTime() - node.performance.lastSeen.getTime();
      
      if (timeSinceLastSeen > 300000) { // 5 minutes
        node.status = 'offline';
        node.healthScore = 0;
      } else if (timeSinceLastSeen > 120000) { // 2 minutes
        node.status = 'degraded';
        node.healthScore = Math.max(30, node.healthScore - 20);
      } else {
        // Update workload and performance metrics
        this.updateNodeMetrics(node);
        node.status = node.healthScore > 80 ? 'online' : 'degraded';
      }

      // Check for critical conditions
      if (node.workload.cpuUsage > 95 || node.workload.memoryUsage > 95) {
        node.status = 'degraded';
        node.healthScore = Math.min(60, node.healthScore);
      }
    }

    // Broadcast cluster status update
    if (this.broadcast) {
      this.broadcast('cluster_health_update', {
        totalNodes: this.nodes.size,
        onlineNodes: Array.from(this.nodes.values()).filter(n => n.status === 'online').length,
        degradedNodes: Array.from(this.nodes.values()).filter(n => n.status === 'degraded').length,
        offlineNodes: Array.from(this.nodes.values()).filter(n => n.status === 'offline').length,
        averageHealth: this.calculateAverageHealth(),
        timestamp: now,
      });
    }
  }

  private updateNodeMetrics(node: ClusterNode): void {
    // Simulate metric updates
    const variation = (Math.random() - 0.5) * 10; // ±5% variation
    
    node.workload.cpuUsage = Math.max(10, Math.min(100, node.workload.cpuUsage + variation));
    node.workload.memoryUsage = Math.max(10, Math.min(100, node.workload.memoryUsage + variation));
    node.workload.gpuUsage = Math.max(20, Math.min(100, node.workload.gpuUsage + variation));
    
    node.performance.hashRate = Math.max(0, node.performance.hashRate + (Math.random() - 0.5) * 20);
    node.performance.efficiency = Math.max(50, Math.min(100, node.performance.efficiency + (Math.random() - 0.5) * 5));
    
    // Update health score based on performance
    node.healthScore = this.calculateNodeHealthScore(node);
    node.performance.lastSeen = new Date();
  }

  private calculateNodeHealthScore(node: ClusterNode): number {
    let score = 100;
    
    // CPU usage impact
    if (node.workload.cpuUsage > 90) score -= 20;
    else if (node.workload.cpuUsage > 80) score -= 10;
    
    // Memory usage impact
    if (node.workload.memoryUsage > 90) score -= 20;
    else if (node.workload.memoryUsage > 80) score -= 10;
    
    // GPU usage impact (higher is better for mining)
    if (node.workload.gpuUsage < 50) score -= 15;
    
    // Efficiency impact
    if (node.performance.efficiency < 70) score -= 15;
    else if (node.performance.efficiency < 80) score -= 5;
    
    // Uptime impact
    if (node.performance.uptime < 95) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateAverageHealth(): number {
    const nodes = Array.from(this.nodes.values());
    if (nodes.length === 0) return 0;
    
    const totalHealth = nodes.reduce((sum, node) => sum + node.healthScore, 0);
    return Math.round(totalHealth / nodes.length);
  }

  private async updateLoadBalancing(): Promise<void> {
    switch (this.loadBalancingStrategy.algorithm) {
      case 'adaptive_ai':
        await this.performAIAdaptiveBalancing();
        break;
      case 'weighted':
        await this.performWeightedBalancing();
        break;
      case 'least_connections':
        await this.performLeastConnectionsBalancing();
        break;
      default:
        await this.performRoundRobinBalancing();
    }
  }

  private async performAIAdaptiveBalancing(): Promise<void> {
    // AI-based load balancing that learns from node performance
    const nodes = Array.from(this.nodes.values()).filter(n => n.status === 'online');
    
    for (const node of nodes) {
      // Calculate optimal task allocation based on performance history
      const optimalLoad = this.calculateOptimalLoad(node);
      const currentLoad = node.workload.currentTasks / node.workload.maxTasks;
      
      if (Math.abs(currentLoad - optimalLoad) > 0.1) {
        // Suggest workload redistribution
        const adjustment = optimalLoad - currentLoad;
        const taskAdjustment = Math.round(adjustment * node.workload.maxTasks);
        
        if (this.broadcast) {
          this.broadcast('load_balancing_suggestion', {
            nodeId: node.id,
            hostname: node.hostname,
            currentTasks: node.workload.currentTasks,
            suggestedTasks: node.workload.currentTasks + taskAdjustment,
            reasoning: `AI optimization suggests ${taskAdjustment > 0 ? 'increasing' : 'decreasing'} load by ${Math.abs(taskAdjustment)} tasks`,
          });
        }
      }
    }
  }

  private calculateOptimalLoad(node: ClusterNode): number {
    // AI-based calculation of optimal load
    let optimalLoad = 0.7; // Base 70% utilization
    
    // Adjust based on efficiency
    if (node.performance.efficiency > 90) optimalLoad += 0.2;
    else if (node.performance.efficiency < 70) optimalLoad -= 0.2;
    
    // Adjust based on health score
    if (node.healthScore > 90) optimalLoad += 0.1;
    else if (node.healthScore < 70) optimalLoad -= 0.3;
    
    // Adjust based on hardware capabilities
    const capabilityScore = (node.capabilities.cpuCores / 32 + node.capabilities.memoryGB / 128 + node.capabilities.gpuCount / 8) / 3;
    optimalLoad += (capabilityScore - 0.5) * 0.2;
    
    return Math.max(0.1, Math.min(0.95, optimalLoad));
  }

  private async performWeightedBalancing(): Promise<void> {
    // Implement weighted load balancing
  }

  private async performLeastConnectionsBalancing(): Promise<void> {
    // Implement least connections balancing
  }

  private async performRoundRobinBalancing(): Promise<void> {
    // Implement round-robin balancing
  }

  private async checkFailoverConditions(): Promise<void> {
    const onlineNodes = Array.from(this.nodes.values()).filter(n => n.status === 'online');
    const degradedNodes = Array.from(this.nodes.values()).filter(n => n.status === 'degraded');
    const offlineNodes = Array.from(this.nodes.values()).filter(n => n.status === 'offline');

    // Check if we need to trigger failover
    for (const offlineNode of offlineNodes) {
      await this.performFailover(offlineNode);
    }

    // Check if degraded nodes need attention
    for (const degradedNode of degradedNodes) {
      if (degradedNode.healthScore < this.failoverStrategy.healthThreshold) {
        await this.performGracefulDegradation(degradedNode);
      }
    }

    // Ensure minimum cluster capacity
    if (onlineNodes.length < 2) {
      logger.warn('Cluster capacity critically low - initiating emergency procedures');
      
      if (this.broadcast) {
        this.broadcast('cluster_emergency', {
          onlineNodes: onlineNodes.length,
          totalNodes: this.nodes.size,
          action: 'emergency_scaling',
          timestamp: new Date(),
        });
      }
    }
  }

  private async performFailover(failedNode: ClusterNode): Promise<void> {
    logger.info(`Performing failover for node: ${failedNode.hostname}`);

    // Find best replacement node
    const replacementNode = this.findBestReplacementNode(failedNode);
    
    if (replacementNode) {
      // Redistribute workload
      const tasksToRedistribute = failedNode.workload.currentTasks;
      const availableCapacity = replacementNode.workload.maxTasks - replacementNode.workload.currentTasks;
      
      if (availableCapacity >= tasksToRedistribute) {
        replacementNode.workload.currentTasks += tasksToRedistribute;
        failedNode.workload.currentTasks = 0;
        
        logger.info(`Redistributed ${tasksToRedistribute} tasks from ${failedNode.hostname} to ${replacementNode.hostname}`);
        
        if (this.broadcast) {
          this.broadcast('failover_completed', {
            failedNode: failedNode.id,
            replacementNode: replacementNode.id,
            redistributedTasks: tasksToRedistribute,
            timestamp: new Date(),
          });
        }
      } else {
        // Distribute across multiple nodes
        await this.distributeWorkloadAcrossCluster(tasksToRedistribute, failedNode.id);
      }
    }
  }

  private findBestReplacementNode(failedNode: ClusterNode): ClusterNode | null {
    const onlineNodes = Array.from(this.nodes.values()).filter(n => 
      n.status === 'online' && n.id !== failedNode.id
    );

    if (onlineNodes.length === 0) return null;

    // Score nodes based on capacity, performance, and location
    return onlineNodes.reduce((best, current) => {
      const currentScore = this.calculateReplacementScore(current, failedNode);
      const bestScore = best ? this.calculateReplacementScore(best, failedNode) : 0;
      
      return currentScore > bestScore ? current : best;
    }, null as ClusterNode | null);
  }

  private calculateReplacementScore(candidate: ClusterNode, failedNode: ClusterNode): number {
    let score = 0;
    
    // Available capacity
    const availableCapacity = candidate.workload.maxTasks - candidate.workload.currentTasks;
    score += availableCapacity * 10;
    
    // Health score
    score += candidate.healthScore;
    
    // Performance
    score += candidate.performance.efficiency;
    
    // Location preference (same region/datacenter is better)
    if (candidate.location.region === failedNode.location.region) score += 20;
    if (candidate.location.datacenter === failedNode.location.datacenter) score += 10;
    
    // Hardware compatibility
    if (candidate.capabilities.gpuCount >= failedNode.capabilities.gpuCount) score += 15;
    
    return score;
  }

  private async distributeWorkloadAcrossCluster(tasks: number, excludeNodeId: string): Promise<void> {
    const availableNodes = Array.from(this.nodes.values()).filter(n => 
      n.status === 'online' && n.id !== excludeNodeId
    );

    if (availableNodes.length === 0) return;

    const totalAvailableCapacity = availableNodes.reduce((sum, node) => 
      sum + (node.workload.maxTasks - node.workload.currentTasks), 0
    );

    if (totalAvailableCapacity < tasks) {
      logger.warn('Insufficient cluster capacity for full workload redistribution');
    }

    // Distribute proportionally based on available capacity
    for (const node of availableNodes) {
      const availableCapacity = node.workload.maxTasks - node.workload.currentTasks;
      const proportion = availableCapacity / totalAvailableCapacity;
      const assignedTasks = Math.min(availableCapacity, Math.floor(tasks * proportion));
      
      node.workload.currentTasks += assignedTasks;
      tasks -= assignedTasks;
      
      if (tasks <= 0) break;
    }
  }

  private async performGracefulDegradation(degradedNode: ClusterNode): Promise<void> {
    logger.info(`Performing graceful degradation for node: ${degradedNode.hostname}`);

    // Reduce workload on degraded node
    const currentTasks = degradedNode.workload.currentTasks;
    const reducedTasks = Math.floor(currentTasks * 0.7); // Reduce to 70%
    const tasksToRedistribute = currentTasks - reducedTasks;

    if (tasksToRedistribute > 0) {
      await this.distributeWorkloadAcrossCluster(tasksToRedistribute, degradedNode.id);
      degradedNode.workload.currentTasks = reducedTasks;

      if (this.broadcast) {
        this.broadcast('graceful_degradation', {
          nodeId: degradedNode.id,
          reducedTasks: tasksToRedistribute,
          newLoad: reducedTasks,
          healthScore: degradedNode.healthScore,
          timestamp: new Date(),
        });
      }
    }
  }

  private async setupInitialCluster(): Promise<void> {
    // Set initial priorities for failover strategy
    const nodes = Array.from(this.nodes.values());
    nodes.forEach((node, index) => {
      this.failoverStrategy.priority[node.id] = nodes.length - index;
    });

    logger.info(`Initial cluster setup completed with ${nodes.length} nodes`);
  }

  async getClusterStatus(): Promise<any> {
    const nodes = Array.from(this.nodes.values());
    
    return {
      totalNodes: nodes.length,
      onlineNodes: nodes.filter(n => n.status === 'online').length,
      degradedNodes: nodes.filter(n => n.status === 'degraded').length,
      offlineNodes: nodes.filter(n => n.status === 'offline').length,
      averageHealth: this.calculateAverageHealth(),
      totalCapacity: {
        cpuCores: nodes.reduce((sum, n) => sum + n.capabilities.cpuCores, 0),
        memoryGB: nodes.reduce((sum, n) => sum + n.capabilities.memoryGB, 0),
        gpuCount: nodes.reduce((sum, n) => sum + n.capabilities.gpuCount, 0),
      },
      currentWorkload: {
        totalTasks: nodes.reduce((sum, n) => sum + n.workload.currentTasks, 0),
        maxTasks: nodes.reduce((sum, n) => sum + n.workload.maxTasks, 0),
        utilizationPercent: Math.round((nodes.reduce((sum, n) => sum + n.workload.currentTasks, 0) / 
                                      Math.max(1, nodes.reduce((sum, n) => sum + n.workload.maxTasks, 0))) * 100),
      },
      performance: {
        totalHashRate: nodes.reduce((sum, n) => sum + n.performance.hashRate, 0),
        averageEfficiency: nodes.length > 0 ? nodes.reduce((sum, n) => sum + n.performance.efficiency, 0) / nodes.length : 0,
      },
      loadBalancingStrategy: this.loadBalancingStrategy.name,
      failoverStrategy: this.failoverStrategy.name,
    };
  }

  getClusterNodes(): ClusterNode[] {
    return Array.from(this.nodes.values());
  }

  async addNode(nodeConfig: Omit<ClusterNode, 'id'>): Promise<ClusterNode> {
    const nodeId = this.generateNodeId(nodeConfig.hostname);
    const node: ClusterNode = {
      id: nodeId,
      ...nodeConfig,
    };

    this.nodes.set(nodeId, node);
    this.failoverStrategy.priority[nodeId] = this.nodes.size;

    logger.info(`Added new cluster node: ${node.hostname}`);

    if (this.broadcast) {
      this.broadcast('node_added', node);
    }

    return node;
  }

  async removeNode(nodeId: string): Promise<boolean> {
    const node = this.nodes.get(nodeId);
    if (!node) return false;

    // Gracefully redistribute workload before removal
    if (node.workload.currentTasks > 0) {
      await this.distributeWorkloadAcrossCluster(node.workload.currentTasks, nodeId);
    }

    this.nodes.delete(nodeId);
    delete this.failoverStrategy.priority[nodeId];

    logger.info(`Removed cluster node: ${node.hostname}`);

    if (this.broadcast) {
      this.broadcast('node_removed', { nodeId, hostname: node.hostname });
    }

    return true;
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Distributed Cluster Manager...');
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
    }
    
    this.isInitialized = false;
    logger.info('Distributed Cluster Manager shut down successfully');
  }
}

export const clusterManager = new ClusterManager();