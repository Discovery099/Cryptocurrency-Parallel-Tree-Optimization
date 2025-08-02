import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  Play, 
  Settings, 
  TrendingUp, 
  Cpu, 
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

interface MerkleConfig {
  id: string;
  name: string;
  parallelThreads: number;
  treeDepth: string;
  cacheStrategy: string;
  isActive: boolean;
  performance: any;
  createdAt: string;
  updatedAt: string;
}

interface AlgorithmStatus {
  name: string;
  status: 'active' | 'optimizing' | 'inactive';
  performance: number;
  threadsUsed: number;
}

export default function MerkleTrees() {
  const [selectedConfig, setSelectedConfig] = useState<string>("");
  const [newConfigName, setNewConfigName] = useState("");
  const [newThreads, setNewThreads] = useState(512);
  const [newDepth, setNewDepth] = useState("auto");
  const [newCache, setNewCache] = useState("adaptive");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configs, isLoading: configsLoading } = useQuery({
    queryKey: ['/api/merkle-configs'],
  });

  const { data: algorithmStatuses } = useQuery({
    queryKey: ['/api/merkle-configs/algorithms'],
  });

  const activateConfigMutation = useMutation({
    mutationFn: (configId: string) => 
      apiRequest('PUT', `/api/merkle-configs/${configId}/activate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/merkle-configs'] });
      toast({
        title: "Configuration Activated",
        description: "Merkle tree configuration has been applied successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate configuration",
        variant: "destructive",
      });
    },
  });

  const createConfigMutation = useMutation({
    mutationFn: (data: any) => 
      apiRequest('POST', '/api/merkle-configs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/merkle-configs'] });
      setNewConfigName("");
      setNewThreads(512);
      setNewDepth("auto");
      setNewCache("adaptive");
      toast({
        title: "Configuration Created",
        description: "New Merkle tree configuration has been created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create configuration",
        variant: "destructive",
      });
    },
  });

  const optimizeMutation = useMutation({
    mutationFn: () => 
      apiRequest('POST', '/api/merkle-configs/optimize', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/merkle-configs'] });
      toast({
        title: "Optimization Started",
        description: "Merkle tree optimization is now running.",
      });
    },
  });

  const handleActivateConfig = (configId: string) => {
    activateConfigMutation.mutate(configId);
  };

  const handleCreateConfig = () => {
    if (!newConfigName.trim()) {
      toast({
        title: "Validation Error",
        description: "Configuration name is required",
        variant: "destructive",
      });
      return;
    }

    createConfigMutation.mutate({
      name: newConfigName,
      parallelThreads: newThreads,
      treeDepth: newDepth,
      cacheStrategy: newCache,
      isActive: false,
    });
  };

  const activeConfig = configs?.find((config: MerkleConfig) => config.isActive);

  return (
    <div className="p-6 space-y-6" data-testid="merkle-trees-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Table className="h-8 w-8 text-emerald-400" />
            Merkle Tree Optimization
          </h1>
          <p className="text-slate-400 mt-2">
            Adaptive parallel Merkle tree construction and optimization
          </p>
        </div>
        <Button 
          onClick={() => optimizeMutation.mutate()}
          disabled={optimizeMutation.isPending}
          className="bg-emerald-500 hover:bg-emerald-600"
          data-testid="button-optimize"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          {optimizeMutation.isPending ? "Optimizing..." : "Auto-Optimize"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="algorithms" data-testid="tab-algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="configurations" data-testid="tab-configurations">Configurations</TabsTrigger>
          <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Configuration Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Active Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {activeConfig ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-50" data-testid="active-config-name">
                        {activeConfig.name}
                      </h3>
                      <p className="text-slate-400">
                        Last updated: {new Date(activeConfig.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-slate-400 text-sm">Parallel Threads</div>
                      <div className="text-2xl font-bold text-slate-50" data-testid="active-threads">
                        {activeConfig.parallelThreads}
                      </div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-slate-400 text-sm">Tree Depth</div>
                      <div className="text-2xl font-bold text-slate-50" data-testid="active-depth">
                        {activeConfig.treeDepth}
                      </div>
                    </div>
                    <div className="bg-slate-700 p-4 rounded-lg">
                      <div className="text-slate-400 text-sm">Cache Strategy</div>
                      <div className="text-2xl font-bold text-slate-50" data-testid="active-cache">
                        {activeConfig.cacheStrategy}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <p className="text-slate-400">No active configuration found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Construction Speed</p>
                    <p className="text-2xl font-bold text-slate-50" data-testid="construction-speed">
                      8,742 ops/s
                    </p>
                  </div>
                  <Cpu className="h-8 w-8 text-emerald-400" />
                </div>
                <Progress value={87} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Parallel Efficiency</p>
                    <p className="text-2xl font-bold text-slate-50" data-testid="parallel-efficiency">
                      94.8%
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-400" />
                </div>
                <Progress value={95} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-slate-50" data-testid="cache-hit-rate">
                      96.2%
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-400" />
                </div>
                <Progress value={96} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Memory Utilization</p>
                    <p className="text-2xl font-bold text-slate-50" data-testid="memory-utilization">
                      72.3%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-cyan-400" />
                </div>
                <Progress value={72} className="mt-3" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="algorithms" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Algorithm Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {algorithmStatuses?.map((algorithm: AlgorithmStatus, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                    data-testid={`algorithm-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        algorithm.status === 'active' ? 'bg-emerald-500' :
                        algorithm.status === 'optimizing' ? 'bg-amber-500' : 'bg-slate-500'
                      }`} />
                      <div>
                        <div className="text-slate-200 font-medium">{algorithm.name}</div>
                        <div className="text-slate-400 text-sm">
                          {algorithm.threadsUsed} threads • {algorithm.performance.toFixed(1)}% efficiency
                        </div>
                      </div>
                    </div>
                    <Badge variant={
                      algorithm.status === 'active' ? 'default' :
                      algorithm.status === 'optimizing' ? 'secondary' : 'outline'
                    }>
                      {algorithm.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations" className="space-y-6">
          {/* Create New Configuration */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Create New Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="config-name" className="text-slate-200">Configuration Name</Label>
                    <Input
                      id="config-name"
                      value={newConfigName}
                      onChange={(e) => setNewConfigName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      placeholder="Enter configuration name"
                      data-testid="input-config-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parallel-threads" className="text-slate-200">Parallel Threads</Label>
                    <Input
                      id="parallel-threads"
                      type="number"
                      min="128"
                      max="2048"
                      value={newThreads}
                      onChange={(e) => setNewThreads(parseInt(e.target.value))}
                      className="bg-slate-700 border-slate-600 text-slate-50"
                      data-testid="input-threads"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tree-depth" className="text-slate-200">Tree Depth</Label>
                    <Select value={newDepth} onValueChange={setNewDepth}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50" data-testid="select-depth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-Adaptive</SelectItem>
                        <SelectItem value="8">Fixed: 8 levels</SelectItem>
                        <SelectItem value="16">Fixed: 16 levels</SelectItem>
                        <SelectItem value="32">Fixed: 32 levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="cache-strategy" className="text-slate-200">Cache Strategy</Label>
                    <Select value={newCache} onValueChange={setNewCache}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-50" data-testid="select-cache">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adaptive">Adaptive Cache</SelectItem>
                        <SelectItem value="lru">LRU Cache</SelectItem>
                        <SelectItem value="lfu">LFU Cache</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={handleCreateConfig}
                  disabled={createConfigMutation.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  data-testid="button-create-config"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {createConfigMutation.isPending ? "Creating..." : "Create Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Configurations */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Saved Configurations</CardTitle>
            </CardHeader>
            <CardContent>
              {configsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {configs?.map((config: MerkleConfig) => (
                    <div
                      key={config.id}
                      className={`p-4 rounded-lg border ${
                        config.isActive 
                          ? 'bg-emerald-500/10 border-emerald-500/20' 
                          : 'bg-slate-700 border-slate-600'
                      }`}
                      data-testid={`config-${config.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-slate-50">
                              {config.name}
                            </h3>
                            {config.isActive && (
                              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <div className="text-slate-400 text-sm mt-1">
                            {config.parallelThreads} threads • {config.treeDepth} depth • {config.cacheStrategy} cache
                          </div>
                        </div>
                        
                        {!config.isActive && (
                          <Button
                            onClick={() => handleActivateConfig(config.id)}
                            disabled={activateConfigMutation.isPending}
                            variant="outline"
                            size="sm"
                            data-testid={`button-activate-${config.id}`}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Performance analytics coming soon</p>
                <p className="text-slate-500 text-sm mt-2">
                  Detailed performance metrics and historical analysis will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
