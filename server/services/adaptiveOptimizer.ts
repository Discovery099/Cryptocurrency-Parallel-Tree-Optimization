import { storage } from "../storage";
import { logger } from "../utils/logger";

interface MiningPattern {
  timestamp: number;
  hashRate: number;
  efficiency: number;
  temperature: number;
  powerUsage: number;
  configuration: any;
  profitability: number;
}

interface OptimizationRecommendation {
  confidence: number;
  expectedImprovement: number;
  riskLevel: 'low' | 'medium' | 'high';
  implementation: {
    parallelThreads: number;
    cacheStrategy: string;
    treeDepth: string;
    gpuAllocation: number[];
  };
  reasoning: string;
}

class AdaptiveOptimizer {
  private isInitialized = false;
  private patterns: MiningPattern[] = [];
  private learningModel: any = null;
  private broadcast?: (event: string, data: any) => void;
  private optimizationInterval?: NodeJS.Timeout;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    logger.info('Initializing Adaptive ML Optimizer...');

    try {
      // Load historical patterns for initial training
      await this.loadHistoricalData();
      
      // Initialize the learning model
      this.initializeLearningModel();
      
      // Start continuous optimization
      this.startOptimizationLoop();
      
      this.isInitialized = true;
      logger.info('Adaptive ML Optimizer initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Adaptive ML Optimizer:', error);
      throw error;
    }
  }

  setBroadcast(broadcastFn: (event: string, data: any) => void): void {
    this.broadcast = broadcastFn;
  }

  private async loadHistoricalData(): Promise<void> {
    // Load last 7 days of mining data for training
    const systemMetrics = await storage.getSystemMetricsHistory(168); // 7 days
    const transactionBatches = await storage.getTransactionBatches(1000);
    const gpus = await storage.getGPUs();

    // Convert data into patterns for ML analysis
    for (const metric of systemMetrics) {
      const pattern: MiningPattern = {
        timestamp: metric.timestamp.getTime(),
        hashRate: metric.totalHashRate,
        efficiency: metric.treeEfficiency,
        temperature: gpus.reduce((avg, gpu) => avg + gpu.temperature, 0) / Math.max(gpus.length, 1),
        powerUsage: gpus.reduce((total, gpu) => total + gpu.power, 0),
        configuration: await this.getConfigurationAtTime(metric.timestamp),
        profitability: metric.dailyRevenue,
      };
      this.patterns.push(pattern);
    }

    logger.info(`Loaded ${this.patterns.length} historical patterns for training`);
  }

  private async getConfigurationAtTime(timestamp: Date): Promise<any> {
    // In a real implementation, this would fetch historical configuration data
    // For now, we'll use current configuration as baseline
    const config = await storage.getActiveMerkleTreeConfig();
    return {
      parallelThreads: config?.parallelThreads || 512,
      cacheStrategy: config?.cacheStrategy || 'adaptive',
      treeDepth: config?.treeDepth || 'auto',
    };
  }

  private initializeLearningModel(): void {
    // Initialize a simplified ML model for pattern recognition
    // In production, this would use libraries like TensorFlow.js or similar
    this.learningModel = {
      weights: this.generateInitialWeights(),
      learningRate: 0.01,
      momentum: 0.9,
      patterns: [],
    };
  }

  private generateInitialWeights(): number[] {
    // Generate initial weights for neural network
    const weightCount = 20; // Number of features * hidden layers
    return Array.from({ length: weightCount }, () => Math.random() * 2 - 1);
  }

  private startOptimizationLoop(): void {
    // Run optimization analysis every 5 minutes
    this.optimizationInterval = setInterval(async () => {
      await this.performOptimizationAnalysis();
    }, 5 * 60 * 1000);
  }

  private async performOptimizationAnalysis(): Promise<void> {
    try {
      // Collect current performance data
      const currentMetrics = await storage.getLatestSystemMetrics();
      const gpus = await storage.getGPUs();
      const activeConfig = await storage.getActiveMerkleTreeConfig();

      if (!currentMetrics || !activeConfig) return;

      // Create current pattern
      const currentPattern: MiningPattern = {
        timestamp: Date.now(),
        hashRate: currentMetrics.totalHashRate,
        efficiency: currentMetrics.treeEfficiency,
        temperature: gpus.reduce((avg, gpu) => avg + gpu.temperature, 0) / Math.max(gpus.length, 1),
        powerUsage: gpus.reduce((total, gpu) => total + gpu.power, 0),
        configuration: activeConfig,
        profitability: currentMetrics.dailyRevenue,
      };

      // Add to patterns for learning
      this.patterns.push(currentPattern);
      if (this.patterns.length > 1000) {
        this.patterns = this.patterns.slice(-1000); // Keep last 1000 patterns
      }

      // Generate optimization recommendation
      const recommendation = await this.generateOptimizationRecommendation(currentPattern);

      // Broadcast recommendation to connected clients
      if (this.broadcast) {
        this.broadcast('ml_optimization_recommendation', {
          currentPattern,
          recommendation,
          timestamp: new Date(),
        });
      }

      // Auto-apply low-risk, high-confidence recommendations
      if (recommendation.confidence > 0.85 && recommendation.riskLevel === 'low') {
        await this.applyOptimizationRecommendation(recommendation);
      }

    } catch (error) {
      logger.error('Error in optimization analysis:', error);
    }
  }

  private async generateOptimizationRecommendation(currentPattern: MiningPattern): Promise<OptimizationRecommendation> {
    // Analyze patterns to find optimal configuration
    const similarPatterns = this.findSimilarPatterns(currentPattern);
    const bestPerformingPattern = this.findBestPerformingPattern(similarPatterns);

    let confidence = 0.5;
    let expectedImprovement = 0;
    let riskLevel: 'low' | 'medium' | 'high' = 'medium';

    if (bestPerformingPattern && similarPatterns.length > 10) {
      confidence = Math.min(0.95, 0.5 + (similarPatterns.length / 100));
      expectedImprovement = ((bestPerformingPattern.efficiency - currentPattern.efficiency) / currentPattern.efficiency) * 100;
      
      if (Math.abs(expectedImprovement) < 5) riskLevel = 'low';
      else if (Math.abs(expectedImprovement) < 15) riskLevel = 'medium';
      else riskLevel = 'high';
    }

    const recommendation: OptimizationRecommendation = {
      confidence,
      expectedImprovement: Math.max(0, expectedImprovement),
      riskLevel,
      implementation: {
        parallelThreads: bestPerformingPattern?.configuration.parallelThreads || currentPattern.configuration.parallelThreads,
        cacheStrategy: bestPerformingPattern?.configuration.cacheStrategy || currentPattern.configuration.cacheStrategy,
        treeDepth: bestPerformingPattern?.configuration.treeDepth || currentPattern.configuration.treeDepth,
        gpuAllocation: this.optimizeGpuAllocation(currentPattern),
      },
      reasoning: this.generateOptimizationReasoning(currentPattern, bestPerformingPattern, similarPatterns.length),
    };

    return recommendation;
  }

  private findSimilarPatterns(targetPattern: MiningPattern): MiningPattern[] {
    return this.patterns.filter(pattern => {
      const hashRateSimilarity = 1 - Math.abs(pattern.hashRate - targetPattern.hashRate) / Math.max(pattern.hashRate, targetPattern.hashRate);
      const tempSimilarity = 1 - Math.abs(pattern.temperature - targetPattern.temperature) / 100;
      const powerSimilarity = 1 - Math.abs(pattern.powerUsage - targetPattern.powerUsage) / Math.max(pattern.powerUsage, targetPattern.powerUsage);
      
      return (hashRateSimilarity + tempSimilarity + powerSimilarity) / 3 > 0.7;
    });
  }

  private findBestPerformingPattern(patterns: MiningPattern[]): MiningPattern | null {
    if (patterns.length === 0) return null;
    
    return patterns.reduce((best, current) => {
      const currentScore = current.efficiency * 0.6 + current.profitability * 0.4;
      const bestScore = best.efficiency * 0.6 + best.profitability * 0.4;
      return currentScore > bestScore ? current : best;
    });
  }

  private optimizeGpuAllocation(pattern: MiningPattern): number[] {
    // Simple GPU allocation optimization based on performance
    const gpuCount = 4; // Assume 4 GPUs for now
    const baseAllocation = Array(gpuCount).fill(25); // Equal distribution
    
    // Adjust based on temperature and efficiency patterns
    if (pattern.temperature > 80) {
      // Reduce allocation to hottest GPUs
      return [20, 20, 30, 30];
    }
    
    return baseAllocation;
  }

  private generateOptimizationReasoning(current: MiningPattern, best: MiningPattern | null, sampleSize: number): string {
    if (!best) {
      return `Insufficient historical data (${sampleSize} similar patterns). Maintaining current configuration with monitoring.`;
    }

    const reasons = [];
    
    if (best.configuration.parallelThreads !== current.configuration.parallelThreads) {
      reasons.push(`Adjust parallel threads from ${current.configuration.parallelThreads} to ${best.configuration.parallelThreads} for better throughput`);
    }
    
    if (best.configuration.cacheStrategy !== current.configuration.cacheStrategy) {
      reasons.push(`Switch cache strategy to ${best.configuration.cacheStrategy} for improved efficiency`);
    }
    
    if (current.temperature > 75) {
      reasons.push(`Current temperature (${current.temperature.toFixed(1)}°C) suggests thermal optimization needed`);
    }
    
    if (reasons.length === 0) {
      reasons.push(`Current configuration performing optimally based on ${sampleSize} similar patterns`);
    }
    
    return reasons.join('. ');
  }

  private async applyOptimizationRecommendation(recommendation: OptimizationRecommendation): Promise<void> {
    try {
      const activeConfig = await storage.getActiveMerkleTreeConfig();
      if (!activeConfig) return;

      // Update configuration with recommendation
      await storage.updateMerkleTreeConfig(activeConfig.id, {
        parallelThreads: recommendation.implementation.parallelThreads,
        cacheStrategy: recommendation.implementation.cacheStrategy,
        treeDepth: recommendation.implementation.treeDepth,
      });

      logger.info(`Auto-applied ML optimization recommendation with ${(recommendation.confidence * 100).toFixed(1)}% confidence`);

      if (this.broadcast) {
        this.broadcast('optimization_applied', {
          recommendation,
          timestamp: new Date(),
          autoApplied: true,
        });
      }

    } catch (error) {
      logger.error('Failed to apply optimization recommendation:', error);
    }
  }

  async getOptimizationStatus(): Promise<any> {
    return {
      isInitialized: this.isInitialized,
      patternsCollected: this.patterns.length,
      modelStatus: this.learningModel ? 'active' : 'inactive',
      lastOptimization: this.patterns.length > 0 ? new Date(this.patterns[this.patterns.length - 1].timestamp) : null,
    };
  }

  async getPerformancePrediction(hours: number): Promise<any> {
    if (this.patterns.length < 10) {
      return {
        prediction: 'insufficient_data',
        confidence: 0,
        expectedHashRate: 0,
        expectedEfficiency: 0,
      };
    }

    // Simple trend analysis for prediction
    const recentPatterns = this.patterns.slice(-24); // Last 24 patterns
    const avgHashRate = recentPatterns.reduce((sum, p) => sum + p.hashRate, 0) / recentPatterns.length;
    const avgEfficiency = recentPatterns.reduce((sum, p) => sum + p.efficiency, 0) / recentPatterns.length;

    // Calculate trend
    const hashRateTrend = this.calculateTrend(recentPatterns.map(p => p.hashRate));
    const efficiencyTrend = this.calculateTrend(recentPatterns.map(p => p.efficiency));

    return {
      prediction: 'available',
      confidence: Math.min(0.9, recentPatterns.length / 24),
      expectedHashRate: avgHashRate + (hashRateTrend * hours),
      expectedEfficiency: avgEfficiency + (efficiencyTrend * hours),
      trend: {
        hashRate: hashRateTrend > 0 ? 'increasing' : hashRateTrend < 0 ? 'decreasing' : 'stable',
        efficiency: efficiencyTrend > 0 ? 'improving' : efficiencyTrend < 0 ? 'declining' : 'stable',
      },
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n + 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + val * (index + 1), 0);
    const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down Adaptive ML Optimizer...');
    
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
    }
    
    this.isInitialized = false;
    logger.info('Adaptive ML Optimizer shut down successfully');
  }
}

export const adaptiveOptimizer = new AdaptiveOptimizer();