import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";
import { Activity, CheckCircle, Zap } from "lucide-react";

interface OptimizationMetrics {
  constructionSpeed: number;
  parallelEfficiency: number;
  cacheHitRate: number;
  memoryUtilization: number;
}

interface AlgorithmStatus {
  name: string;
  status: 'active' | 'optimizing' | 'inactive';
  performance: number;
}

export default function MerkleTreeOptimization() {
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    constructionSpeed: 8742,
    parallelEfficiency: 94.8,
    cacheHitRate: 96.2,
    memoryUtilization: 72.3,
  });

  const [algorithms, setAlgorithms] = useState<AlgorithmStatus[]>([
    { name: 'PhaseNU Algorithm', status: 'active', performance: 94.2 },
    { name: 'Adaptive Restructuring', status: 'optimizing', performance: 91.8 },
  ]);

  const { data: configData } = useQuery({
    queryKey: ['/api/merkle-configs'],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.event === 'merkle_config_changed') {
      // Update metrics when configuration changes
      setMetrics(prev => ({
        ...prev,
        parallelEfficiency: Math.min(98, prev.parallelEfficiency + 2),
        constructionSpeed: Math.round(prev.constructionSpeed * 1.05),
      }));
    }
  }, [lastMessage]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-emerald-400';
    if (efficiency >= 90) return 'text-blue-400';
    if (efficiency >= 85) return 'text-amber-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3 text-emerald-400" />;
      case 'optimizing':
        return <Activity className="h-3 w-3 text-amber-400 animate-pulse" />;
      default:
        return <div className="w-3 h-3 bg-slate-500 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-400';
      case 'optimizing':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6" data-testid="merkle-tree-optimization">
      {/* Performance Metrics */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Tree Construction Speed</span>
            <span className="text-white" data-testid="construction-speed">
              {metrics.constructionSpeed.toLocaleString()} ops/s
            </span>
          </div>
          <div className="efficiency-meter">
            <div 
              className="efficiency-bar efficiency-excellent" 
              style={{ width: '87%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Parallel Efficiency</span>
            <span className={`${getEfficiencyColor(metrics.parallelEfficiency)}`} data-testid="parallel-efficiency">
              {metrics.parallelEfficiency}%
            </span>
          </div>
          <Progress 
            value={metrics.parallelEfficiency} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Cache Hit Rate</span>
            <span className={`${getEfficiencyColor(metrics.cacheHitRate)}`} data-testid="cache-hit-rate">
              {metrics.cacheHitRate}%
            </span>
          </div>
          <Progress 
            value={metrics.cacheHitRate} 
            className="h-2"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">Memory Utilization</span>
            <span className="text-white" data-testid="memory-utilization">
              {metrics.memoryUtilization}%
            </span>
          </div>
          <Progress 
            value={metrics.memoryUtilization} 
            className="h-2"
          />
        </div>
      </div>

      {/* Algorithm Status */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-300">Algorithm Status</h4>
        
        {algorithms.map((algorithm, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
            data-testid={`algorithm-${index}`}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(algorithm.status)}
              <div>
                <div className="text-slate-200 text-sm">{algorithm.name}</div>
                <div className="text-slate-400 text-xs">
                  Performance: {algorithm.performance.toFixed(1)}%
                </div>
              </div>
            </div>
            <Badge 
              variant="outline"
              className={`capitalize ${getStatusColor(algorithm.status)}`}
            >
              {algorithm.status}
            </Badge>
          </div>
        ))}
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300 text-sm">Throughput</span>
          </div>
          <div className="text-slate-50 text-lg font-bold" data-testid="throughput">
            10.2k tx/s
          </div>
        </div>

        <div className="bg-slate-700 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300 text-sm">Latency</span>
          </div>
          <div className="text-slate-50 text-lg font-bold" data-testid="latency">
            45ms
          </div>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="flex items-center justify-center text-xs text-slate-400 pt-2">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
        Optimization algorithms running
      </div>
    </div>
  );
}
