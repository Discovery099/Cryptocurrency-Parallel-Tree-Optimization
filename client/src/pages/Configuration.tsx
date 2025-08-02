import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Cpu, 
  HardDrive, 
  Network, 
  Save, 
  RotateCcw,
  Download,
  Upload,
  Zap,
  Activity,
  Shield
} from "lucide-react";

interface ConfigSection {
  [key: string]: any;
}

export default function Configuration() {
  const [hasChanges, setHasChanges] = useState(false);
  const [algorithmConfig, setAlgorithmConfig] = useState({
    parallelThreads: 512,
    treeDepth: "auto",
    cacheStrategy: "adaptive",
  });
  
  const [hardwareConfig, setHardwareConfig] = useState({
    gpuMemoryAllocation: 75,
    cudaEnabled: true,
    powerManagement: true,
    temperatureThrottle: true,
  });
  
  const [networkConfig, setNetworkConfig] = useState({
    failoverTimeout: 30,
    maxConnections: 50,
    loadBalancing: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['/api/configs'],
  });

  const applyConfigMutation = useMutation({
    mutationFn: (configData: any) => 
      apiRequest('POST', '/api/configs/apply', configData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configs'] });
      setHasChanges(false);
      toast({
        title: "Configuration Applied",
        description: "All configuration changes have been applied successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to apply configuration changes",
        variant: "destructive",
      });
    },
  });

  const optimizeConfigMutation = useMutation({
    mutationFn: () => 
      apiRequest('POST', '/api/configs/optimize', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configs'] });
      toast({
        title: "Configuration Optimized",
        description: "System configuration has been automatically optimized.",
      });
    },
  });

  const exportConfigMutation = useMutation({
    mutationFn: () => 
      apiRequest('GET', '/api/configs/export', {}),
    onSuccess: (response) => {
      // Handle file download
      toast({
        title: "Configuration Exported",
        description: "Configuration has been exported successfully.",
      });
    },
  });

  const handleConfigChange = (section: string, key: string, value: any) => {
    setHasChanges(true);
    
    switch (section) {
      case 'algorithm':
        setAlgorithmConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'hardware':
        setHardwareConfig(prev => ({ ...prev, [key]: value }));
        break;
      case 'network':
        setNetworkConfig(prev => ({ ...prev, [key]: value }));
        break;
    }
  };

  const handleApplyConfiguration = () => {
    const configData = {
      'mining.parallel_threads': algorithmConfig.parallelThreads,
      'mining.tree_depth': algorithmConfig.treeDepth,
      'mining.cache_strategy': algorithmConfig.cacheStrategy,
      'gpu.memory_allocation': hardwareConfig.gpuMemoryAllocation,
      'gpu.cuda_enabled': hardwareConfig.cudaEnabled,
      'gpu.power_management': hardwareConfig.powerManagement,
      'gpu.temperature_throttle': hardwareConfig.temperatureThrottle,
      'network.failover_timeout': networkConfig.failoverTimeout,
      'network.max_connections': networkConfig.maxConnections,
      'network.load_balancing': networkConfig.loadBalancing,
    };

    applyConfigMutation.mutate(configData);
  };

  const handleResetToDefaults = () => {
    setAlgorithmConfig({
      parallelThreads: 512,
      treeDepth: "auto",
      cacheStrategy: "adaptive",
    });
    setHardwareConfig({
      gpuMemoryAllocation: 75,
      cudaEnabled: true,
      powerManagement: true,
      temperatureThrottle: true,
    });
    setNetworkConfig({
      failoverTimeout: 30,
      maxConnections: 50,
      loadBalancing: true,
    });
    setHasChanges(true);
  };

  return (
    <div className="p-6 space-y-6" data-testid="configuration-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Settings className="h-8 w-8 text-amber-400" />
            System Configuration
          </h1>
          <p className="text-slate-400 mt-2">
            Configure mining algorithms, hardware optimization, and network settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportConfigMutation.mutate()}
            disabled={exportConfigMutation.isPending}
            data-testid="button-export-config"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => optimizeConfigMutation.mutate()}
            disabled={optimizeConfigMutation.isPending}
            data-testid="button-auto-optimize"
          >
            <Zap className="h-4 w-4 mr-2" />
            {optimizeConfigMutation.isPending ? "Optimizing..." : "Auto-Optimize"}
          </Button>
        </div>
      </div>

      {/* Configuration Status */}
      {hasChanges && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 font-medium">Unsaved Changes</span>
                <span className="text-slate-400">Configuration changes are pending</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetToDefaults}
                  data-testid="button-reset-changes"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyConfiguration}
                  disabled={applyConfigMutation.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  data-testid="button-apply-config"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {applyConfigMutation.isPending ? "Applying..." : "Apply Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="algorithm" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="algorithm" data-testid="tab-algorithm">
            <Cpu className="h-4 w-4 mr-2" />
            Algorithm
          </TabsTrigger>
          <TabsTrigger value="hardware" data-testid="tab-hardware">
            <HardDrive className="h-4 w-4 mr-2" />
            Hardware
          </TabsTrigger>
          <TabsTrigger value="network" data-testid="tab-network">
            <Network className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="security" data-testid="tab-security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithm" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Parallel Processing Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="parallel-threads" className="text-slate-200">
                    Parallel Threads
                  </Label>
                  <Badge variant="outline" className="text-slate-400">
                    {algorithmConfig.parallelThreads}
                  </Badge>
                </div>
                <Slider
                  id="parallel-threads"
                  min={128}
                  max={2048}
                  step={64}
                  value={[algorithmConfig.parallelThreads]}
                  onValueChange={(value) => 
                    handleConfigChange('algorithm', 'parallelThreads', value[0])
                  }
                  className="w-full"
                  data-testid="slider-parallel-threads"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>128</span>
                  <span>Optimal: 512</span>
                  <span>2048</span>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <Label htmlFor="tree-depth" className="text-slate-200 mb-3 block">
                  Tree Depth Optimization
                </Label>
                <Select
                  value={algorithmConfig.treeDepth}
                  onValueChange={(value) => 
                    handleConfigChange('algorithm', 'treeDepth', value)
                  }
                >
                  <SelectTrigger 
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="select-tree-depth"
                  >
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
                <Label htmlFor="cache-strategy" className="text-slate-200 mb-3 block">
                  Cache Strategy
                </Label>
                <Select
                  value={algorithmConfig.cacheStrategy}
                  onValueChange={(value) => 
                    handleConfigChange('algorithm', 'cacheStrategy', value)
                  }
                >
                  <SelectTrigger 
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="select-cache-strategy"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adaptive">Adaptive Cache</SelectItem>
                    <SelectItem value="lru">LRU Cache</SelectItem>
                    <SelectItem value="lfu">LFU Cache</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Advanced Algorithm Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-slate-200 font-medium">Merkle Tree Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Tree Depth</span>
                      <span className="text-slate-50">32 levels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Cache Size</span>
                      <span className="text-slate-50">60,000 nodes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hash Algorithm</span>
                      <span className="text-slate-50">SHA-256</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-slate-200 font-medium">Performance Targets</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Efficiency</span>
                      <span className="text-emerald-400">≥95%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Latency</span>
                      <span className="text-slate-50">50ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Throughput Target</span>
                      <span className="text-slate-50">10k tx/s</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">GPU Optimization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="gpu-memory" className="text-slate-200">
                    GPU Memory Allocation
                  </Label>
                  <Badge variant="outline" className="text-slate-400">
                    {hardwareConfig.gpuMemoryAllocation}%
                  </Badge>
                </div>
                <Slider
                  id="gpu-memory"
                  min={50}
                  max={90}
                  step={5}
                  value={[hardwareConfig.gpuMemoryAllocation]}
                  onValueChange={(value) => 
                    handleConfigChange('hardware', 'gpuMemoryAllocation', value[0])
                  }
                  className="w-full"
                  data-testid="slider-gpu-memory"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50%</span>
                  <span>Recommended: 75%</span>
                  <span>90%</span>
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cuda-enabled" className="text-slate-200">
                      CUDA Acceleration
                    </Label>
                    <p className="text-slate-400 text-sm">Enable NVIDIA CUDA for parallel processing</p>
                  </div>
                  <Switch
                    id="cuda-enabled"
                    checked={hardwareConfig.cudaEnabled}
                    onCheckedChange={(checked) => 
                      handleConfigChange('hardware', 'cudaEnabled', checked)
                    }
                    data-testid="switch-cuda"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="power-management" className="text-slate-200">
                      Auto Power Management
                    </Label>
                    <p className="text-slate-400 text-sm">Automatically adjust power consumption</p>
                  </div>
                  <Switch
                    id="power-management"
                    checked={hardwareConfig.powerManagement}
                    onCheckedChange={(checked) => 
                      handleConfigChange('hardware', 'powerManagement', checked)
                    }
                    data-testid="switch-power-management"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="temperature-throttle" className="text-slate-200">
                      Temperature Throttling
                    </Label>
                    <p className="text-slate-400 text-sm">Reduce performance at high temperatures</p>
                  </div>
                  <Switch
                    id="temperature-throttle"
                    checked={hardwareConfig.temperatureThrottle}
                    onCheckedChange={(checked) => 
                      handleConfigChange('hardware', 'temperatureThrottle', checked)
                    }
                    data-testid="switch-temperature-throttle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">System Resource Limits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="max-cpu" className="text-slate-200 mb-2 block">
                    Max CPU Usage (%)
                  </Label>
                  <Input
                    id="max-cpu"
                    type="number"
                    min="50"
                    max="95"
                    defaultValue="85"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-max-cpu"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-memory" className="text-slate-200 mb-2 block">
                    Max Memory Usage (%)
                  </Label>
                  <Input
                    id="max-memory"
                    type="number"
                    min="60"
                    max="90"
                    defaultValue="80"
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-max-memory"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Network Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="failover-timeout" className="text-slate-200 mb-2 block">
                    Pool Failover Timeout (seconds)
                  </Label>
                  <Input
                    id="failover-timeout"
                    type="number"
                    min="10"
                    max="300"
                    value={networkConfig.failoverTimeout}
                    onChange={(e) => 
                      handleConfigChange('network', 'failoverTimeout', parseInt(e.target.value))
                    }
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-failover-timeout"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-connections" className="text-slate-200 mb-2 block">
                    Max Connections
                  </Label>
                  <Input
                    id="max-connections"
                    type="number"
                    min="1"
                    max="100"
                    value={networkConfig.maxConnections}
                    onChange={(e) => 
                      handleConfigChange('network', 'maxConnections', parseInt(e.target.value))
                    }
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    data-testid="input-max-connections"
                  />
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="load-balancing" className="text-slate-200">
                    Load Balancing
                  </Label>
                  <p className="text-slate-400 text-sm">Distribute load across multiple pools</p>
                </div>
                <Switch
                  id="load-balancing"
                  checked={networkConfig.loadBalancing}
                  onCheckedChange={(checked) => 
                    handleConfigChange('network', 'loadBalancing', checked)
                  }
                  data-testid="switch-load-balancing"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Connection Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm">Ping Interval</div>
                  <div className="text-slate-50 text-lg font-bold">10s</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm">Retry Attempts</div>
                  <div className="text-slate-50 text-lg font-bold">3</div>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-slate-400 text-sm">Timeout Threshold</div>
                  <div className="text-slate-50 text-lg font-bold">5000ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Security Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Security settings coming soon</p>
                <p className="text-slate-500 text-sm mt-2">
                  Advanced security configuration options will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
