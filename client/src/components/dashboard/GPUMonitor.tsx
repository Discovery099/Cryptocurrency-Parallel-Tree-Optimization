import { useGPUData } from "@/hooks/useGPUData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import StatusIndicator from "@/components/ui/status-indicator";
import { RefreshCw, Settings } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface GPU {
  id: string;
  name: string;
  model: string;
  hashRate: number;
  temperature: number;
  power: number;
  memoryUsed: number;
  memoryTotal: number;
  utilizationRate: number;
  status: 'online' | 'offline' | 'warning' | 'error';
}

export default function GPUMonitor() {
  const { data: gpus, isLoading, refetch } = useGPUData();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const optimizeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/gpus/optimize', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gpus'] });
      toast({
        title: "GPU Optimization Started",
        description: "GPU optimization is now running across all devices.",
      });
    },
  });

  const getTemperatureColor = (temp: number) => {
    if (temp > 85) return 'text-red-400';
    if (temp > 80) return 'text-amber-400';
    return 'text-emerald-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="gpu-monitor">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-50">GPU Status</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            data-testid="button-refresh-gpus"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            size="sm"
            onClick={() => optimizeMutation.mutate()}
            disabled={optimizeMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600"
            data-testid="button-optimize-gpus"
          >
            {optimizeMutation.isPending ? "Optimizing..." : "Auto-Optimize"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gpus?.slice(0, 6).map((gpu: GPU) => (
          <div
            key={gpu.id}
            className={`gpu-card ${gpu.status}`}
            data-testid={`gpu-card-${gpu.id}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <StatusIndicator status={gpu.status} />
                <span className="text-slate-200 text-sm font-medium">{gpu.name}</span>
              </div>
              <Button variant="ghost" size="sm" data-testid={`gpu-settings-${gpu.id}`}>
                <Settings className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Hash Rate</span>
                <span className="text-slate-50" data-testid={`gpu-hashrate-${gpu.id}`}>
                  {gpu.hashRate.toFixed(1)} TH/s
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Temperature</span>
                <span className={`${getTemperatureColor(gpu.temperature)}`} data-testid={`gpu-temperature-${gpu.id}`}>
                  {gpu.temperature}°C
                </span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Power</span>
                <span className="text-slate-50" data-testid={`gpu-power-${gpu.id}`}>
                  {gpu.power}W
                </span>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Memory</span>
                  <span className="text-slate-50">
                    {gpu.memoryUsed.toFixed(1)}GB / {gpu.memoryTotal.toFixed(1)}GB
                  </span>
                </div>
                <Progress 
                  value={(gpu.memoryUsed / gpu.memoryTotal) * 100} 
                  className="h-1"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Utilization</span>
                  <span className="text-slate-50" data-testid={`gpu-utilization-${gpu.id}`}>
                    {gpu.utilizationRate}%
                  </span>
                </div>
                <Progress 
                  value={gpu.utilizationRate} 
                  className="h-1"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {gpus && gpus.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-400">No GPUs detected</p>
          <p className="text-slate-500 text-sm mt-1">Add GPUs to start monitoring</p>
        </div>
      )}
    </div>
  );
}
