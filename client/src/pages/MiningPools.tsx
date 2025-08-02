import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StatusIndicator from "@/components/ui/status-indicator";
import { 
  Network,
  Plus,
  Settings,
  Activity,
  Wifi,
  WifiOff,
  Users,
  Clock,
  Signal,
  Trash2,
  RefreshCw
} from "lucide-react";

interface MiningPool {
  id: string;
  name: string;
  url: string;
  port: number;
  username: string;
  password?: string;
  difficulty?: number;
  latency: number;
  status: 'connected' | 'disconnected' | 'standby';
  isActive: boolean;
  priority: number;
  workers: number;
  createdAt: string;
  updatedAt: string;
}

export default function MiningPools() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPool, setNewPool] = useState({
    name: "",
    url: "",
    port: 4444,
    username: "",
    password: "",
    priority: 1,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pools, isLoading, refetch } = useQuery({
    queryKey: ['/api/mining-pools'],
  });

  const activatePoolMutation = useMutation({
    mutationFn: (poolId: string) => 
      apiRequest('PUT', `/api/mining-pools/${poolId}/activate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining-pools'] });
      toast({
        title: "Pool Activated",
        description: "Mining pool has been activated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate mining pool",
        variant: "destructive",
      });
    },
  });

  const addPoolMutation = useMutation({
    mutationFn: (poolData: any) => 
      apiRequest('POST', '/api/mining-pools', poolData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining-pools'] });
      setIsAddDialogOpen(false);
      setNewPool({
        name: "",
        url: "",
        port: 4444,
        username: "",
        password: "",
        priority: 1,
      });
      toast({
        title: "Pool Added",
        description: "New mining pool has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Pool",
        description: error.message || "Could not add mining pool",
        variant: "destructive",
      });
    },
  });

  const deletePoolMutation = useMutation({
    mutationFn: (poolId: string) => 
      apiRequest('DELETE', `/api/mining-pools/${poolId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mining-pools'] });
      toast({
        title: "Pool Removed",
        description: "Mining pool has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Pool",
        description: error.message || "Could not remove mining pool",
        variant: "destructive",
      });
    },
  });

  const handleActivatePool = (poolId: string) => {
    activatePoolMutation.mutate(poolId);
  };

  const handleAddPool = () => {
    if (!newPool.name.trim() || !newPool.url.trim() || !newPool.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Name, URL, and username are required",
        variant: "destructive",
      });
      return;
    }

    addPoolMutation.mutate(newPool);
  };

  const handleDeletePool = (poolId: string, poolName: string) => {
    if (confirm(`Are you sure you want to remove "${poolName}"?`)) {
      deletePoolMutation.mutate(poolId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'emerald';
      case 'standby': return 'amber';
      case 'disconnected': return 'red';
      default: return 'slate';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 20) return 'text-emerald-400';
    if (latency < 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const activePool = pools?.find((pool: MiningPool) => pool.isActive);
  const poolStats = pools ? {
    total: pools.length,
    connected: pools.filter((pool: MiningPool) => pool.status === 'connected').length,
    avgLatency: pools.length > 0 ? 
      pools.reduce((sum: number, pool: MiningPool) => sum + pool.latency, 0) / pools.length : 0,
    totalWorkers: pools.reduce((sum: number, pool: MiningPool) => sum + pool.workers, 0),
  } : null;

  return (
    <div className="p-6 space-y-6" data-testid="mining-pools-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Network className="h-8 w-8 text-blue-400" />
            Mining Pools
          </h1>
          <p className="text-slate-400 mt-2">
            Manage mining pool connections and failover configurations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={isLoading}
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600" data-testid="button-add-pool">
                <Plus className="h-4 w-4 mr-2" />
                Add Pool
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-slate-50">Add New Mining Pool</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pool-name" className="text-slate-200">Pool Name</Label>
                    <Input
                      id="pool-name"
                      value={newPool.name}
                      onChange={(e) => setNewPool({...newPool, name: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="e.g., SlushPool"
                      data-testid="input-pool-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pool-priority" className="text-slate-200">Priority</Label>
                    <Input
                      id="pool-priority"
                      type="number"
                      min="1"
                      max="10"
                      value={newPool.priority}
                      onChange={(e) => setNewPool({...newPool, priority: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      data-testid="input-pool-priority"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="pool-url" className="text-slate-200">Pool URL</Label>
                    <Input
                      id="pool-url"
                      value={newPool.url}
                      onChange={(e) => setNewPool({...newPool, url: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="stratum+tcp://pool.example.com"
                      data-testid="input-pool-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pool-port" className="text-slate-200">Port</Label>
                    <Input
                      id="pool-port"
                      type="number"
                      value={newPool.port}
                      onChange={(e) => setNewPool({...newPool, port: parseInt(e.target.value)})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      data-testid="input-pool-port"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pool-username" className="text-slate-200">Username</Label>
                    <Input
                      id="pool-username"
                      value={newPool.username}
                      onChange={(e) => setNewPool({...newPool, username: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="mining_username"
                      data-testid="input-pool-username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pool-password" className="text-slate-200">Password (Optional)</Label>
                    <Input
                      id="pool-password"
                      type="password"
                      value={newPool.password}
                      onChange={(e) => setNewPool({...newPool, password: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="x"
                      data-testid="input-pool-password"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    data-testid="button-cancel-add"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPool}
                    disabled={addPoolMutation.isPending}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    data-testid="button-confirm-add"
                  >
                    {addPoolMutation.isPending ? "Adding..." : "Add Pool"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Pool Statistics */}
      {poolStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Total Pools</div>
              <div className="text-2xl font-bold text-slate-50" data-testid="stat-total-pools">
                {poolStats.total}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Connected</div>
              <div className="text-2xl font-bold text-emerald-400" data-testid="stat-connected-pools">
                {poolStats.connected}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Avg Latency</div>
              <div className={`text-2xl font-bold ${getLatencyColor(poolStats.avgLatency)}`} data-testid="stat-avg-latency">
                {poolStats.avgLatency.toFixed(0)}ms
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Total Workers</div>
              <div className="text-2xl font-bold text-slate-50" data-testid="stat-total-workers">
                {poolStats.totalWorkers}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="active" data-testid="tab-active">Active Pool</TabsTrigger>
          <TabsTrigger value="manage" data-testid="tab-manage">Manage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-800 rounded-lg animate-pulse" />
              ))
            ) : (
              pools?.map((pool: MiningPool) => (
                <Card
                  key={pool.id}
                  className={`bg-slate-800 border-slate-700 transition-all duration-200 hover:border-slate-600 ${
                    pool.isActive ? 'border-emerald-500/20 bg-emerald-500/5' : ''
                  }`}
                  data-testid={`pool-card-${pool.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-50 text-lg">{pool.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        {pool.isActive && (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            Active
                          </Badge>
                        )}
                        <StatusIndicator status={pool.status === 'connected' ? 'online' : 'offline'} />
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm">{pool.url}:{pool.port}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400 flex items-center gap-1">
                          <Signal className="h-3 w-3" />
                          Latency
                        </div>
                        <div className={`font-semibold ${getLatencyColor(pool.latency)}`} data-testid={`pool-latency-${pool.id}`}>
                          {pool.latency}ms
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Workers
                        </div>
                        <div className="text-slate-50 font-semibold" data-testid={`pool-workers-${pool.id}`}>
                          {pool.workers}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Priority</div>
                        <div className="text-slate-50 font-semibold" data-testid={`pool-priority-${pool.id}`}>
                          #{pool.priority}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Status</div>
                        <div className={`font-semibold capitalize ${getStatusColor(pool.status) === 'emerald' ? 'text-emerald-400' : 
                          getStatusColor(pool.status) === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>
                          {pool.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                      <span className="text-slate-400 text-xs">
                        Added {new Date(pool.createdAt).toLocaleDateString()}
                      </span>
                      
                      <div className="flex space-x-1">
                        {!pool.isActive && (
                          <Button
                            size="sm"
                            onClick={() => handleActivatePool(pool.id)}
                            disabled={activatePoolMutation.isPending}
                            className="bg-emerald-500 hover:bg-emerald-600"
                            data-testid={`button-activate-${pool.id}`}
                          >
                            <Activity className="h-3 w-3 mr-1" />
                            Activate
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-edit-${pool.id}`}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {activePool ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50 flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-emerald-400" />
                  Active Mining Pool: {activePool.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Connection Status</div>
                    <div className="text-emerald-400 text-xl font-bold" data-testid="active-pool-status">
                      {activePool.status}
                    </div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Active Workers</div>
                    <div className="text-slate-50 text-xl font-bold" data-testid="active-pool-workers">
                      {activePool.workers}
                    </div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Latency</div>
                    <div className={`text-xl font-bold ${getLatencyColor(activePool.latency)}`} data-testid="active-pool-latency">
                      {activePool.latency}ms
                    </div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <div className="text-slate-400 text-sm">Difficulty</div>
                    <div className="text-slate-50 text-xl font-bold" data-testid="active-pool-difficulty">
                      {activePool.difficulty ? `${(activePool.difficulty / 1e12).toFixed(1)}T` : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="text-slate-50 font-medium mb-2">Connection Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">URL:</span>
                      <span className="text-slate-50 ml-2">{activePool.url}:{activePool.port}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Username:</span>
                      <span className="text-slate-50 ml-2">{activePool.username}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Priority:</span>
                      <span className="text-slate-50 ml-2">#{activePool.priority}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="text-slate-50 ml-2">{new Date(activePool.updatedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-12 text-center">
                <WifiOff className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-50 mb-2">No Active Pool</h3>
                <p className="text-slate-400">No mining pool is currently active. Please activate a pool to start mining.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Manage Mining Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pools?.map((pool: MiningPool) => (
                  <div
                    key={pool.id}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                    data-testid={`pool-manage-${pool.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <StatusIndicator status={pool.status === 'connected' ? 'online' : 'offline'} />
                      <div>
                        <div className="text-slate-50 font-medium flex items-center gap-2">
                          {pool.name}
                          {pool.isActive && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              Active
                            </Badge>
                          )}
                        </div>
                        <div className="text-slate-400 text-sm">{pool.url}:{pool.port}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-slate-50 text-sm font-medium">
                          {pool.workers} workers
                        </div>
                        <div className={`text-sm ${getLatencyColor(pool.latency)}`}>
                          {pool.latency}ms latency
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!pool.isActive && (
                          <Button
                            size="sm"
                            onClick={() => handleActivatePool(pool.id)}
                            disabled={activatePoolMutation.isPending}
                            className="bg-emerald-500 hover:bg-emerald-600"
                            data-testid={`button-manage-activate-${pool.id}`}
                          >
                            <Activity className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-manage-edit-${pool.id}`}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        {!pool.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePool(pool.id, pool.name)}
                            disabled={deletePoolMutation.isPending}
                            className="text-red-400 hover:text-red-300 hover:border-red-400"
                            data-testid={`button-manage-delete-${pool.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
