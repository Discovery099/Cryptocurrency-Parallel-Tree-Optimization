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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useGPUData } from "@/hooks/useGPUData";
import StatusIndicator from "@/components/ui/status-indicator";
import { 
  Microchip,
  Thermometer,
  Zap,
  Activity,
  Settings,
  Plus,
  RefreshCw,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

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
  lastSeen: string;
}

export default function GPUManagement() {
  const [selectedGPU, setSelectedGPU] = useState<string>("");
  const [newGPUName, setNewGPUName] = useState("");
  const [newGPUModel, setNewGPUModel] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: gpus, isLoading, refetch } = useGPUData();

  const optimizeMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/gpus/optimize', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gpus'] });
      toast({
        title: "Optimization Started",
        description: "GPU optimization is now running across all devices.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to start GPU optimization",
        variant: "destructive",
      });
    },
  });

  const addGPUMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/gpus', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gpus'] });
      setNewGPUName("");
      setNewGPUModel("");
      toast({
        title: "GPU Added",
        description: "New GPU has been added to the mining setup.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add GPU",
        description: error.message || "Could not add the GPU",
        variant: "destructive",
      });
    },
  });

  const removeGPUMutation = useMutation({
    mutationFn: (gpuId: string) => apiRequest('DELETE', `/api/gpus/${gpuId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/gpus'] });
      toast({
        title: "GPU Removed",
        description: "GPU has been removed from the mining setup.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove GPU",
        description: error.message || "Could not remove the GPU",
        variant: "destructive",
      });
    },
  });

  const handleOptimizeAll = () => {
    optimizeMutation.mutate();
  };

  const handleAddGPU = () => {
    if (!newGPUName.trim() || !newGPUModel.trim()) {
      toast({
        title: "Validation Error",
        description: "GPU name and model are required",
        variant: "destructive",
      });
      return;
    }

    addGPUMutation.mutate({
      name: newGPUName,
      model: newGPUModel,
      hashRate: 0,
      temperature: 45,
      power: 200,
      memoryUsed: 8.0,
      memoryTotal: 24.0,
      utilizationRate: 0,
      status: 'offline',
    });
  };

  const handleRemoveGPU = (gpuId: string) => {
    if (confirm("Are you sure you want to remove this GPU?")) {
      removeGPUMutation.mutate(gpuId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'emerald';
      case 'warning': return 'amber';
      case 'error': return 'red';
      default: return 'slate';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 85) return 'text-red-400';
    if (temp > 80) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const gpuStats = gpus ? {
    total: gpus.length,
    online: gpus.filter((gpu: GPU) => gpu.status === 'online').length,
    warning: gpus.filter((gpu: GPU) => gpu.status === 'warning').length,
    error: gpus.filter((gpu: GPU) => gpu.status === 'error').length,
    offline: gpus.filter((gpu: GPU) => gpu.status === 'offline').length,
    totalHashRate: gpus.reduce((sum: number, gpu: GPU) => sum + gpu.hashRate, 0),
    avgTemperature: gpus.length > 0 ? gpus.reduce((sum: number, gpu: GPU) => sum + gpu.temperature, 0) / gpus.length : 0,
    totalPower: gpus.reduce((sum: number, gpu: GPU) => sum + gpu.power, 0),
  } : null;

  return (
    <div className="p-6 space-y-6" data-testid="gpu-management-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <Microchip className="h-8 w-8 text-purple-400" />
            GPU Management
          </h1>
          <p className="text-slate-400 mt-2">
            Monitor and optimize GPU performance for cryptocurrency mining
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
          <Button
            onClick={handleOptimizeAll}
            disabled={optimizeMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600"
            data-testid="button-optimize-all"
          >
            <Activity className="h-4 w-4 mr-2" />
            {optimizeMutation.isPending ? "Optimizing..." : "Optimize All"}
          </Button>
        </div>
      </div>

      {/* GPU Statistics */}
      {gpuStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Total GPUs</div>
              <div className="text-2xl font-bold text-slate-50" data-testid="stat-total-gpus">
                {gpuStats.total}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Online</div>
              <div className="text-2xl font-bold text-emerald-400" data-testid="stat-online-gpus">
                {gpuStats.online}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Total Hash Rate</div>
              <div className="text-2xl font-bold text-slate-50" data-testid="stat-total-hashrate">
                {gpuStats.totalHashRate.toFixed(1)} TH/s
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Avg Temperature</div>
              <div className={`text-2xl font-bold ${getTemperatureColor(gpuStats.avgTemperature)}`} data-testid="stat-avg-temperature">
                {gpuStats.avgTemperature.toFixed(0)}°C
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="text-slate-400 text-sm">Total Power</div>
              <div className="text-2xl font-bold text-slate-50" data-testid="stat-total-power">
                {gpuStats.totalPower}W
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="monitor" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="monitor" data-testid="tab-monitor">Monitor</TabsTrigger>
          <TabsTrigger value="manage" data-testid="tab-manage">Manage</TabsTrigger>
          <TabsTrigger value="settings" data-testid="tab-settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-6">
          {/* GPU Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-slate-800 rounded-lg animate-pulse" />
              ))
            ) : (
              gpus?.map((gpu: GPU) => (
                <Card
                  key={gpu.id}
                  className={`bg-slate-800 border-slate-700 transition-all duration-200 hover:border-slate-600 ${
                    gpu.status === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                    gpu.status === 'error' ? 'border-red-500/20 bg-red-500/5' : ''
                  }`}
                  data-testid={`gpu-card-${gpu.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-50 text-lg">{gpu.name}</CardTitle>
                      <StatusIndicator status={gpu.status} />
                    </div>
                    <p className="text-slate-400 text-sm">{gpu.model}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-400">Hash Rate</div>
                        <div className="text-slate-50 font-semibold" data-testid={`gpu-hashrate-${gpu.id}`}>
                          {gpu.hashRate.toFixed(1)} TH/s
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Temperature</div>
                        <div className={`font-semibold ${getTemperatureColor(gpu.temperature)}`} data-testid={`gpu-temperature-${gpu.id}`}>
                          {gpu.temperature}°C
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Power</div>
                        <div className="text-slate-50 font-semibold" data-testid={`gpu-power-${gpu.id}`}>
                          {gpu.power}W
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400">Utilization</div>
                        <div className="text-slate-50 font-semibold" data-testid={`gpu-utilization-${gpu.id}`}>
                          {gpu.utilizationRate}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Memory Usage</span>
                        <span className="text-slate-50">
                          {gpu.memoryUsed.toFixed(1)}GB / {gpu.memoryTotal.toFixed(1)}GB
                        </span>
                      </div>
                      <Progress 
                        value={(gpu.memoryUsed / gpu.memoryTotal) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Performance</span>
                        <span className="text-slate-50">{gpu.utilizationRate}%</span>
                      </div>
                      <Progress 
                        value={gpu.utilizationRate} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Add New GPU */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Add New GPU</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gpu-name" className="text-slate-200">GPU Name</Label>
                  <Input
                    id="gpu-name"
                    value={newGPUName}
                    onChange={(e) => setNewGPUName(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="e.g., RTX 4090 #4"
                    data-testid="input-gpu-name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gpu-model" className="text-slate-200">GPU Model</Label>
                  <Input
                    id="gpu-model"
                    value={newGPUModel}
                    onChange={(e) => setNewGPUModel(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-slate-50"
                    placeholder="e.g., NVIDIA RTX 4090"
                    data-testid="input-gpu-model"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={handleAddGPU}
                  disabled={addGPUMutation.isPending}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  data-testid="button-add-gpu"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addGPUMutation.isPending ? "Adding..." : "Add GPU"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* GPU Management List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Manage GPUs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gpus?.map((gpu: GPU) => (
                  <div
                    key={gpu.id}
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                    data-testid={`gpu-manage-${gpu.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <StatusIndicator status={gpu.status} />
                      <div>
                        <div className="text-slate-50 font-medium">{gpu.name}</div>
                        <div className="text-slate-400 text-sm">{gpu.model}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-slate-50 text-sm font-medium">
                          {gpu.hashRate.toFixed(1)} TH/s
                        </div>
                        <div className={`text-sm ${getTemperatureColor(gpu.temperature)}`}>
                          {gpu.temperature}°C
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-configure-${gpu.id}`}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveGPU(gpu.id)}
                          disabled={removeGPUMutation.isPending}
                          className="text-red-400 hover:text-red-300 hover:border-red-400"
                          data-testid={`button-remove-${gpu.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">GPU Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">GPU settings panel coming soon</p>
                <p className="text-slate-500 text-sm mt-2">
                  Advanced GPU configuration options will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
