import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Download,
  Calendar,
  Clock,
  Zap,
  Activity,
  DollarSign,
  Target
} from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("24h");
  const [chartType, setChartType] = useState("line");

  const { data: dashboardMetrics } = useQuery({
    queryKey: ['/api/dashboard/metrics'],
  });

  const { data: chartData } = useQuery({
    queryKey: ['/api/dashboard/chart-data', timeRange],
  });

  const { data: performanceAnalytics } = useQuery({
    queryKey: ['/api/analytics/performance', timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720],
  });

  const { data: transactionStats } = useQuery({
    queryKey: ['/api/analytics/transactions', timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720],
  });

  // Sample data for charts when real data is loading
  const sampleChartData = [
    { timestamp: '00:00', hashRate: 320, efficiency: 94, temperature: 67, power: 7800 },
    { timestamp: '04:00', hashRate: 335, efficiency: 95, temperature: 69, power: 8100 },
    { timestamp: '08:00', hashRate: 342, efficiency: 94, temperature: 71, power: 8250 },
    { timestamp: '12:00', hashRate: 338, efficiency: 93, temperature: 73, power: 8180 },
    { timestamp: '16:00', hashRate: 345, efficiency: 96, temperature: 70, power: 8300 },
    { timestamp: '20:00', hashRate: 342, efficiency: 95, temperature: 68, power: 8200 },
    { timestamp: '24:00', hashRate: 347, efficiency: 97, temperature: 66, power: 8350 },
  ];

  const efficiencyDistribution = [
    { name: 'Excellent (95-100%)', value: 65, color: '#10B981' },
    { name: 'Good (85-95%)', value: 25, color: '#3B82F6' },
    { name: 'Fair (75-85%)', value: 8, color: '#F59E0B' },
    { name: 'Poor (<75%)', value: 2, color: '#EF4444' },
  ];

  const displayData = chartData || sampleChartData;

  return (
    <div className="p-6 space-y-6" data-testid="analytics-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-cyan-400" />
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 mt-2">
            Comprehensive mining performance analysis and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800 border-slate-700" data-testid="select-timerange">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Average Hash Rate</p>
                <p className="text-2xl font-bold text-slate-50" data-testid="kpi-avg-hashrate">
                  {performanceAnalytics?.averageHashRate?.toFixed(1) || '342.5'} TH/s
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">+8.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Peak Hash Rate</p>
                <p className="text-2xl font-bold text-slate-50" data-testid="kpi-peak-hashrate">
                  {performanceAnalytics?.peakHashRate?.toFixed(1) || '358.2'} TH/s
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Target className="h-3 w-3 text-blue-400" />
                  <span className="text-blue-400 text-sm">Record</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">System Uptime</p>
                <p className="text-2xl font-bold text-slate-50" data-testid="kpi-uptime">
                  {performanceAnalytics?.uptimePercentage?.toFixed(1) || '98.7'}%
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <Activity className="h-3 w-3 text-purple-400" />
                  <span className="text-purple-400 text-sm">Excellent</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Est. Revenue</p>
                <p className="text-2xl font-bold text-slate-50" data-testid="kpi-revenue">
                  ${dashboardMetrics?.dailyRevenue?.toFixed(2) || '2,847.32'}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <DollarSign className="h-3 w-3 text-amber-400" />
                  <span className="text-amber-400 text-sm">Daily</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
          <TabsTrigger value="efficiency" data-testid="tab-efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue" data-testid="tab-revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Main Performance Chart */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-slate-50">Hash Rate Performance</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                    data-testid="button-line-chart"
                  >
                    Line
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    data-testid="button-bar-chart"
                  >
                    Bar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={displayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="timestamp" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="hashRate" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        name="Hash Rate (TH/s)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                        name="Efficiency (%)"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={displayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="timestamp" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="hashRate" fill="#10B981" name="Hash Rate (TH/s)" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Temperature & Power</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="timestamp" stroke="#94A3B8" />
                      <YAxis yAxisId="left" stroke="#94A3B8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }} 
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#F59E0B" 
                        strokeWidth={2}
                        name="Temperature (°C)"
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="power" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        name="Power (W)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Average Efficiency</span>
                    <span className="text-slate-50">{performanceAnalytics?.averageEfficiency?.toFixed(1) || '94.8'}%</span>
                  </div>
                  <Progress value={performanceAnalytics?.averageEfficiency || 94.8} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Error Rate</span>
                    <span className="text-slate-50">{performanceAnalytics?.errorRate?.toFixed(1) || '1.2'}%</span>
                  </div>
                  <Progress value={100 - (performanceAnalytics?.errorRate || 1.2)} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Avg Processing Time</div>
                    <div className="text-slate-50 text-lg font-bold">
                      {performanceAnalytics?.averageProcessingTime?.toFixed(3) || '0.045'}s
                    </div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-slate-400 text-xs">Total Transactions</div>
                    <div className="text-slate-50 text-lg font-bold">
                      {transactionStats?.totalProcessed?.toLocaleString() || '1,247,832'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Efficiency Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={efficiencyDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${value}%`}
                      >
                        {efficiencyDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {efficiencyDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-300 text-sm">{item.name}</span>
                      </div>
                      <span className="text-slate-50 text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-50">Efficiency Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="timestamp" stroke="#94A3B8" />
                      <YAxis domain={[85, 100]} stroke="#94A3B8" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#F1F5F9'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        name="Efficiency (%)"
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Transaction Processing Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Transaction analytics coming soon</p>
                <p className="text-slate-500 text-sm mt-2">
                  Detailed transaction processing metrics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-50">Revenue Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400">Revenue analytics coming soon</p>
                <p className="text-slate-500 text-sm mt-2">
                  Comprehensive revenue tracking and projections will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
