import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Settings, Zap, Save } from "lucide-react";

interface ConfigState {
  algorithm: {
    parallelThreads: number;
    treeDepth: string;
    cacheStrategy: string;
  };
  hardware: {
    gpuMemoryAllocation: number;
    cudaEnabled: boolean;
    powerManagement: boolean;
    temperatureThrottle: boolean;
  };
  network: {
    failoverTimeout: number;
    maxConnections: number;
    loadBalancing: boolean;
  };
}

export default function ConfigurationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [config, setConfig] = useState<ConfigState>({
    algorithm: {
      parallelThreads: 512,
      treeDepth: "auto",
      cacheStrategy: "adaptive",
    },
    hardware: {
      gpuMemoryAllocation: 75,
      cudaEnabled: true,
      powerManagement: true,
      temperatureThrottle: true,
    },
    network: {
      failoverTimeout: 30,
      maxConnections: 50,
      loadBalancing: true,
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  const applyConfigMutation = useMutation({
    mutationFn: (configData: any) => 
      apiRequest('POST', '/api/configs/apply', configData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/configs'] });
      setHasChanges(false);
      toast({
        title: "Configuration Applied",
        description: "System configuration has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Configuration Failed",
        description: error.message || "Failed to apply configuration",
        variant: "destructive",
      });
    },
  });

  const handleConfigChange = (section: keyof ConfigState, key: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleApplyConfiguration = () => {
    const configData = {
      'mining.parallel_threads': config.algorithm.parallelThreads,
      'mining.tree_depth': config.algorithm.treeDepth,
      'mining.cache_strategy': config.algorithm.cacheStrategy,
      'gpu.memory_allocation': config.hardware.gpuMemoryAllocation,
      'gpu.cuda_enabled': config.hardware.cudaEnabled,
      'gpu.power_management': config.hardware.powerManagement,
      'gpu.temperature_throttle': config.hardware.temperatureThrottle,
      'network.failover_timeout': config.network.failoverTimeout,
      'network.max_connections': config.network.maxConnections,
      'network.load_balancing': config.network.loadBalancing,
    };

    applyConfigMutation.mutate(configData);
  };

  return (
    <div className="space-y-6" data-testid="configuration-panel">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Algorithm Settings */}
        <div className="config-section">
          <h4 className="text-sm font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Algorithm Parameters
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="parallel-threads" className="text-xs text-slate-400">
                  Parallel Threads
                </Label>
                <span className="text-white text-sm" data-testid="parallel-threads-value">
                  {config.algorithm.parallelThreads}
                </span>
              </div>
              <Slider
                id="parallel-threads"
                min={128}
                max={1024}
                step={64}
                value={[config.algorithm.parallelThreads]}
                onValueChange={(value) => 
                  handleConfigChange('algorithm', 'parallelThreads', value[0])
                }
                className="w-full"
                data-testid="slider-parallel-threads"
              />
            </div>

            <div>
              <Label htmlFor="tree-depth" className="text-xs text-slate-400 mb-2 block">
                Tree Depth Optimization
              </Label>
              <Select
                value={config.algorithm.treeDepth}
                onValueChange={(value) => 
                  handleConfigChange('algorithm', 'treeDepth', value)
                }
              >
                <SelectTrigger 
                  className="bg-slate-700 border-slate-600 text-slate-50 h-8"
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
              <Label htmlFor="cache-strategy" className="text-xs text-slate-400 mb-2 block">
                Cache Strategy
              </Label>
              <Select
                value={config.algorithm.cacheStrategy}
                onValueChange={(value) => 
                  handleConfigChange('algorithm', 'cacheStrategy', value)
                }
              >
                <SelectTrigger 
                  className="bg-slate-700 border-slate-600 text-slate-50 h-8"
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
          </div>
        </div>

        {/* Hardware Optimization */}
        <div className="config-section">
          <h4 className="text-sm font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Hardware Optimization
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="gpu-memory" className="text-xs text-slate-400">
                  GPU Memory Allocation
                </Label>
                <span className="text-white text-sm" data-testid="gpu-memory-value">
                  {config.hardware.gpuMemoryAllocation}%
                </span>
              </div>
              <Slider
                id="gpu-memory"
                min={50}
                max={90}
                step={5}
                value={[config.hardware.gpuMemoryAllocation]}
                onValueChange={(value) => 
                  handleConfigChange('hardware', 'gpuMemoryAllocation', value[0])
                }
                className="w-full"
                data-testid="slider-gpu-memory"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">CUDA Acceleration</span>
                <Switch
                  checked={config.hardware.cudaEnabled}
                  onCheckedChange={(checked) => 
                    handleConfigChange('hardware', 'cudaEnabled', checked)
                  }
                  data-testid="switch-cuda"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Auto Power Management</span>
                <Switch
                  checked={config.hardware.powerManagement}
                  onCheckedChange={(checked) => 
                    handleConfigChange('hardware', 'powerManagement', checked)
                  }
                  data-testid="switch-power-management"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Temperature Throttling</span>
                <Switch
                  checked={config.hardware.temperatureThrottle}
                  onCheckedChange={(checked) => 
                    handleConfigChange('hardware', 'temperatureThrottle', checked)
                  }
                  data-testid="switch-temperature-throttle"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="config-section">
          <h4 className="text-sm font-medium text-slate-200 mb-4">Network Configuration</h4>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="failover-timeout" className="text-xs text-slate-400 mb-2 block">
                Pool Failover Timeout
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="failover-timeout"
                  type="number"
                  min="10"
                  max="300"
                  value={config.network.failoverTimeout}
                  onChange={(e) => 
                    handleConfigChange('network', 'failoverTimeout', parseInt(e.target.value))
                  }
                  className="bg-slate-700 border-slate-600 text-slate-50 h-8"
                  data-testid="input-failover-timeout"
                />
                <span className="text-slate-400 text-xs">sec</span>
              </div>
            </div>

            <div>
              <Label htmlFor="max-connections" className="text-xs text-slate-400 mb-2 block">
                Max Connections
              </Label>
              <Input
                id="max-connections"
                type="number"
                min="1"
                max="100"
                value={config.network.maxConnections}
                onChange={(e) => 
                  handleConfigChange('network', 'maxConnections', parseInt(e.target.value))
                }
                className="bg-slate-700 border-slate-600 text-slate-50 h-8"
                data-testid="input-max-connections"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Load Balancing</span>
              <Switch
                checked={config.network.loadBalancing}
                onCheckedChange={(checked) => 
                  handleConfigChange('network', 'loadBalancing', checked)
                }
                data-testid="switch-load-balancing"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Configuration Button */}
      {hasChanges && (
        <div className="flex justify-center">
          <Button
            onClick={handleApplyConfiguration}
            disabled={applyConfigMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600"
            data-testid="button-apply-configuration"
          >
            <Save className="h-4 w-4 mr-2" />
            {applyConfigMutation.isPending ? "Applying..." : "Apply Configuration"}
          </Button>
        </div>
      )}
    </div>
  );
}
