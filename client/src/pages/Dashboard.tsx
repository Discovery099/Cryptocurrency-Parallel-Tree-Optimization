import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MetricsCard from "@/components/dashboard/MetricsCard";
import HashRateChart from "@/components/dashboard/HashRateChart";
import GPUMonitor from "@/components/dashboard/GPUMonitor";
import MiningPoolStatus from "@/components/dashboard/MiningPoolStatus";
import TransactionProcessor from "@/components/dashboard/TransactionProcessor";
import SystemAlerts from "@/components/dashboard/SystemAlerts";
import ConfigurationPanel from "@/components/dashboard/ConfigurationPanel";
import MerkleTreeOptimization from "@/components/dashboard/MerkleTreeOptimization";
import { useMiningData } from "@/hooks/useMiningData";
import { useGPUData } from "@/hooks/useGPUData";
import { Bolt, ChartPie, Microchip, DollarSign } from "lucide-react";

export default function Dashboard() {
  const { data: miningData, isLoading: miningLoading } = useMiningData();
  const { data: gpuData, isLoading: gpuLoading } = useGPUData();

  if (miningLoading || gpuLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = miningData?.metrics || {
    hashRate: 0,
    hashRateChange: 0,
    efficiency: 0,
    efficiencyChange: 0,
    activeGPUs: "0/0",
    revenue: 0,
    revenueChange: 0,
  };

  return (
    <div className="p-6 space-y-6" data-testid="dashboard-container">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Hash Rate"
          value={`${metrics.hashRate} TH/s`}
          change={metrics.hashRateChange}
          icon={Bolt}
          color="emerald"
          data-testid="metrics-hashrate"
        />
        
        <MetricsCard
          title="Tree Efficiency"
          value={`${metrics.efficiency}%`}
          change={metrics.efficiencyChange}
          icon={ChartPie}
          color="blue"
          data-testid="metrics-efficiency"
        />
        
        <MetricsCard
          title="Active GPUs"
          value={metrics.activeGPUs}
          status="All Online"
          icon={Microchip}
          color="purple"
          data-testid="metrics-gpus"
        />
        
        <MetricsCard
          title="Daily Revenue"
          value={`$${metrics.revenue}`}
          change={metrics.revenueChange}
          icon={DollarSign}
          color="amber"
          data-testid="metrics-revenue"
        />
      </div>

      {/* Charts and Real-time Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700" data-testid="chart-hashrate">
          <CardHeader>
            <CardTitle className="text-slate-50">Hash Rate Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <HashRateChart />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700" data-testid="merkle-optimization">
          <CardHeader>
            <CardTitle className="text-slate-50">Merkle Tree Optimization Status</CardTitle>
          </CardHeader>
          <CardContent>
            <MerkleTreeOptimization />
          </CardContent>
        </Card>
      </div>

      {/* GPU Management and Mining Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-slate-800 border-slate-700" data-testid="gpu-monitor">
            <CardHeader>
              <CardTitle className="text-slate-50">GPU Performance Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <GPUMonitor />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700" data-testid="mining-pool-status">
          <CardHeader>
            <CardTitle className="text-slate-50">Mining Pool Status</CardTitle>
          </CardHeader>
          <CardContent>
            <MiningPoolStatus />
          </CardContent>
        </Card>
      </div>

      {/* Transaction Processing and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700" data-testid="transaction-processor">
          <CardHeader>
            <CardTitle className="text-slate-50">Real-time Transaction Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionProcessor />
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700" data-testid="system-alerts">
          <CardHeader>
            <CardTitle className="text-slate-50">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <SystemAlerts />
          </CardContent>
        </Card>
      </div>

      {/* Advanced Configuration Panel */}
      <Card className="bg-slate-800 border-slate-700" data-testid="configuration-panel">
        <CardHeader>
          <CardTitle className="text-slate-50">Parallel Processing Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigurationPanel />
        </CardContent>
      </Card>
    </div>
  );
}
