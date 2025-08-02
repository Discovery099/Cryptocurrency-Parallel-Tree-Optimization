import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusIndicator from "@/components/ui/status-indicator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Activity, Signal, Users } from "lucide-react";

interface MiningPool {
  id: string;
  name: string;
  url: string;
  port: number;
  username: string;
  difficulty?: number;
  latency: number;
  status: 'connected' | 'disconnected' | 'standby';
  isActive: boolean;
  priority: number;
  workers: number;
}

export default function MiningPoolStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pools, isLoading } = useQuery({
    queryKey: ['/api/mining-pools'],
  });

  const activatePoolMutation = useMutation({
    mutationFn: (poolId: string) => 
      apiRequest('PUT', `/api/mining-pools/${poolId}/activate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining-pools'] });
      toast({
        title: "Pool Activated",
        description: "Mining pool has been switched successfully.",
      });
    },
  });

  const activePool = pools?.find((pool: MiningPool) => pool.isActive);
  const standbyPools = pools?.filter((pool: MiningPool) => !pool.isActive) || [];

  const getLatencyColor = (latency: number) => {
    if (latency < 20) return 'text-emerald-400';
    if (latency < 50) return 'text-amber-400';
    return 'text-red-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 bg-slate-700 rounded-lg animate-pulse" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="mining-pool-status">
      {/* Active Pool */}
      {activePool ? (
        <div className="pool-active rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <StatusIndicator status="online" />
              <span className="text-emerald-400 text-sm font-medium" data-testid="active-pool-name">
                {activePool.name}
              </span>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Connected
            </Badge>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-300">Workers</span>
              <span className="text-white" data-testid="active-pool-workers">
                {activePool.workers}/24
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Difficulty</span>
              <span className="text-white" data-testid="active-pool-difficulty">
                {activePool.difficulty ? `${(activePool.difficulty / 1e12).toFixed(1)}T` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Latency</span>
              <span className={getLatencyColor(activePool.latency)} data-testid="active-pool-latency">
                {activePool.latency}ms
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="pool-disconnected rounded-lg p-4 border text-center">
          <div className="text-red-400 text-sm">No Active Pool</div>
          <div className="text-slate-500 text-xs mt-1">Please activate a mining pool</div>
        </div>
      )}

      {/* Backup Pools */}
      <div className="space-y-2">
        <h4 className="text-slate-300 text-sm font-medium">Backup Pools</h4>
        {standbyPools.slice(0, 2).map((pool: MiningPool) => (
          <div
            key={pool.id}
            className="pool-standby rounded-lg p-3 border flex items-center justify-between"
            data-testid={`backup-pool-${pool.id}`}
          >
            <div>
              <div className="text-slate-200 text-sm" data-testid={`backup-pool-name-${pool.id}`}>
                {pool.name}
              </div>
              <div className="text-xs text-slate-400">
                {pool.status} • Priority #{pool.priority}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`text-xs ${getLatencyColor(pool.latency)}`}>
                {pool.latency}ms
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => activatePoolMutation.mutate(pool.id)}
                disabled={activatePoolMutation.isPending}
                className="text-xs h-6 px-2"
                data-testid={`activate-pool-${pool.id}`}
              >
                <Activity className="h-3 w-3 mr-1" />
                Switch
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full text-slate-200"
        data-testid="button-add-pool"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Pool
      </Button>
    </div>
  );
}
