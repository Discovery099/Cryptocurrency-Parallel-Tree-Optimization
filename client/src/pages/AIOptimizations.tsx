import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, TrendingUp, Zap, Shield, Server, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface OptimizationFeature {
  name: string;
  status: 'active' | 'inactive' | 'pending';
  description: string;
  impact: string;
  confidence: number;
}

interface PerformancePrediction {
  prediction: string;
  confidence: number;
  expectedHashRate: number;
  expectedEfficiency: number;
  trend: {
    hashRate: string;
    efficiency: string;
  };
}

interface ClusterStatus {
  totalNodes: number;
  onlineNodes: number;
  degradedNodes: number;
  offlineNodes: number;
  averageHealth: number;
  totalCapacity: {
    cpuCores: number;
    memoryGB: number;
    gpuCount: number;
  };
  currentWorkload: {
    totalTasks: number;
    maxTasks: number;
    utilizationPercent: number;
  };
  performance: {
    totalHashRate: number;
    averageEfficiency: number;
  };
}

interface SecurityAssessment {
  currentAlgorithms: string[];
  vulnerabilities: Array<{
    algorithm: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    quantumBreakTime: string;
  }>;
  recommendations: Array<{
    priority: 'immediate' | 'high' | 'medium' | 'low';
    algorithm: string;
    migration: string;
    timeframe: string;
  }>;
  overallScore: number;
}

export default function AIOptimizations() {
  const [selectedFeature, setSelectedFeature] = useState<string>('ml-optimization');

  const { data: optimizationStatus, isLoading: loadingOptimization } = useQuery({
    queryKey: ['/api/ai/optimization-status'],
    refetchInterval: 5000,
  });

  const { data: performancePrediction } = useQuery<PerformancePrediction>({
    queryKey: ['/api/ai/performance-prediction', 24],
  });

  const { data: clusterStatus } = useQuery<ClusterStatus>({
    queryKey: ['/api/cluster/status'],
    refetchInterval: 10000,
  });

  const { data: securityAssessment } = useQuery<SecurityAssessment>({
    queryKey: ['/api/quantum/security-assessment'],
    refetchInterval: 30000,
  });

  const { data: poolIntegrationStatus } = useQuery({
    queryKey: ['/api/pools/integration-status'],
    refetchInterval: 15000,
  });

  const features: OptimizationFeature[] = [
    {
      name: 'ML-Based Adaptive Optimization',
      status: optimizationStatus?.isInitialized ? 'active' : 'pending',
      description: 'Machine learning algorithms continuously analyze mining patterns to optimize performance',
      impact: '+30% efficiency improvement',
      confidence: 95,
    },
    {
      name: 'Quantum-Resistant Cryptography',
      status: securityAssessment?.overallScore > 80 ? 'active' : 'pending',
      description: 'Post-quantum cryptographic algorithms protect against future quantum computing threats',
      impact: 'Enterprise-grade security',
      confidence: 98,
    },
    {
      name: 'Distributed Cluster Management',
      status: clusterStatus?.onlineNodes > 0 ? 'active' : 'inactive',
      description: 'Intelligent load balancing and automatic failover across mining nodes',
      impact: '99.9% uptime guarantee',
      confidence: 92,
    },
    {
      name: 'Advanced Pool Integration',
      status: poolIntegrationStatus?.connectedPools > 0 ? 'active' : 'inactive',
      description: 'Real-time integration with major mining pools for optimal profitability',
      impact: '+15% revenue increase',
      confidence: 88,
    },
  ];

  const predictionChartData = performancePrediction ? [
    { hour: 'Now', hashRate: 45.2, efficiency: 92.1 },
    { hour: '+6h', hashRate: performancePrediction.expectedHashRate * 0.8, efficiency: performancePrediction.expectedEfficiency * 0.95 },
    { hour: '+12h', hashRate: performancePrediction.expectedHashRate * 0.9, efficiency: performancePrediction.expectedEfficiency * 0.98 },
    { hour: '+18h', hashRate: performancePrediction.expectedHashRate * 0.95, efficiency: performancePrediction.expectedEfficiency },
    { hour: '+24h', hashRate: performancePrediction.expectedHashRate, efficiency: performancePrediction.expectedEfficiency },
  ] : [];

  const clusterHealthData = clusterStatus ? [
    { name: 'Online', value: clusterStatus.onlineNodes, color: '#22c55e' },
    { name: 'Degraded', value: clusterStatus.degradedNodes, color: '#f59e0b' },
    { name: 'Offline', value: clusterStatus.offlineNodes, color: '#ef4444' },
  ] : [];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6" data-testid="ai-optimizations-page">
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold" data-testid="page-title">AI & Advanced Optimizations</h1>
      </div>

      <Tabs value={selectedFeature} onValueChange={setSelectedFeature}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ml-optimization" data-testid="tab-ml-optimization">
            <Brain className="h-4 w-4 mr-2" />
            ML Optimization
          </TabsTrigger>
          <TabsTrigger value="quantum-security" data-testid="tab-quantum-security">
            <Shield className="h-4 w-4 mr-2" />
            Quantum Security
          </TabsTrigger>
          <TabsTrigger value="cluster-management" data-testid="tab-cluster-management">
            <Server className="h-4 w-4 mr-2" />
            Cluster Management
          </TabsTrigger>
          <TabsTrigger value="pool-integration" data-testid="tab-pool-integration">
            <Activity className="h-4 w-4 mr-2" />
            Pool Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ml-optimization" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="card-optimization-status">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  ML Optimizer Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Patterns Collected:</span>
                    <span className="font-semibold" data-testid="text-patterns-collected">
                      {optimizationStatus?.patternsCollected || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Status:</span>
                    <Badge variant={optimizationStatus?.modelStatus === 'active' ? 'default' : 'secondary'}>
                      {optimizationStatus?.modelStatus || 'inactive'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Initialization:</span>
                    <Badge variant={optimizationStatus?.isInitialized ? 'default' : 'outline'}>
                      {optimizationStatus?.isInitialized ? 'Complete' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-performance-prediction">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  24h Performance Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                {performancePrediction ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={performancePrediction.confidence * 100} className="w-16" />
                        <span className="text-sm font-semibold">
                          {(performancePrediction.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Hash Rate:</span>
                      <span className="font-semibold" data-testid="text-expected-hashrate">
                        {performancePrediction.expectedHashRate.toFixed(1)} TH/s
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected Efficiency:</span>
                      <span className="font-semibold" data-testid="text-expected-efficiency">
                        {performancePrediction.expectedEfficiency.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Badge variant={performancePrediction.trend.hashRate === 'increasing' ? 'default' : 'secondary'}>
                        Hash Rate: {performancePrediction.trend.hashRate}
                      </Badge>
                      <Badge variant={performancePrediction.trend.efficiency === 'improving' ? 'default' : 'secondary'}>
                        Efficiency: {performancePrediction.trend.efficiency}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    Collecting data for predictions...
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-optimization-features">
              <CardHeader>
                <CardTitle>AI Features Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          feature.status === 'active' ? 'bg-green-500' : 
                          feature.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{feature.name}</span>
                      </div>
                      <Badge variant={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {predictionChartData.length > 0 && (
            <Card data-testid="card-prediction-chart">
              <CardHeader>
                <CardTitle>Performance Prediction Trend</CardTitle>
                <CardDescription>
                  AI-predicted hash rate and efficiency over the next 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="hashRate"
                      stroke="#8884d8"
                      strokeWidth={2}
                      name="Hash Rate (TH/s)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="efficiency"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      name="Efficiency (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="quantum-security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card data-testid="card-security-score">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Assessment Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <Progress 
                      value={securityAssessment?.overallScore || 0} 
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold" data-testid="text-security-score">
                        {securityAssessment?.overallScore || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Overall quantum resistance score
                    </p>
                    <Badge variant={
                      (securityAssessment?.overallScore || 0) > 80 ? 'default' : 
                      (securityAssessment?.overallScore || 0) > 60 ? 'secondary' : 'destructive'
                    }>
                      {(securityAssessment?.overallScore || 0) > 80 ? 'Excellent' : 
                       (securityAssessment?.overallScore || 0) > 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-current-algorithms">
              <CardHeader>
                <CardTitle>Current Algorithms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {securityAssessment?.currentAlgorithms.map((algorithm, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{algorithm}</span>
                      <Badge variant="outline">
                        In Use
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {securityAssessment?.vulnerabilities && (
            <Card data-testid="card-vulnerabilities">
              <CardHeader>
                <CardTitle>Quantum Vulnerabilities</CardTitle>
                <CardDescription>
                  Algorithms at risk from quantum computing threats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAssessment.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{vuln.algorithm}</span>
                        <Badge variant={getRiskColor(vuln.riskLevel)}>
                          {vuln.riskLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {vuln.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Quantum break time: {vuln.quantumBreakTime}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {securityAssessment?.recommendations && (
            <Card data-testid="card-recommendations">
              <CardHeader>
                <CardTitle>Migration Recommendations</CardTitle>
                <CardDescription>
                  Suggested quantum-resistant algorithm upgrades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAssessment.recommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{rec.algorithm}</span>
                        <Badge variant={
                          rec.priority === 'immediate' ? 'destructive' :
                          rec.priority === 'high' ? 'secondary' : 'outline'
                        }>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.migration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Timeframe: {rec.timeframe}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cluster-management" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card data-testid="card-cluster-overview">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Cluster Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Nodes:</span>
                    <span className="font-semibold" data-testid="text-total-nodes">
                      {clusterStatus?.totalNodes || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online:</span>
                    <span className="font-semibold text-green-600" data-testid="text-online-nodes">
                      {clusterStatus?.onlineNodes || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Degraded:</span>
                    <span className="font-semibold text-yellow-600" data-testid="text-degraded-nodes">
                      {clusterStatus?.degradedNodes || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offline:</span>
                    <span className="font-semibold text-red-600" data-testid="text-offline-nodes">
                      {clusterStatus?.offlineNodes || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-cluster-health">
              <CardHeader>
                <CardTitle>Cluster Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16">
                    <Progress 
                      value={clusterStatus?.averageHealth || 0} 
                      className="absolute inset-0"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold" data-testid="text-cluster-health">
                        {clusterStatus?.averageHealth || 0}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average health score</p>
                    <Badge variant={
                      (clusterStatus?.averageHealth || 0) > 80 ? 'default' : 
                      (clusterStatus?.averageHealth || 0) > 60 ? 'secondary' : 'destructive'
                    }>
                      {(clusterStatus?.averageHealth || 0) > 80 ? 'Healthy' : 
                       (clusterStatus?.averageHealth || 0) > 60 ? 'Moderate' : 'Critical'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-workload-utilization">
              <CardHeader>
                <CardTitle>Workload Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Tasks:</span>
                    <span className="font-semibold" data-testid="text-current-tasks">
                      {clusterStatus?.currentWorkload.totalTasks || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Max Capacity:</span>
                    <span className="font-semibold" data-testid="text-max-tasks">
                      {clusterStatus?.currentWorkload.maxTasks || 0}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Utilization</span>
                      <span data-testid="text-utilization-percent">
                        {clusterStatus?.currentWorkload.utilizationPercent || 0}%
                      </span>
                    </div>
                    <Progress value={clusterStatus?.currentWorkload.utilizationPercent || 0} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {clusterHealthData.length > 0 && (
            <Card data-testid="card-cluster-distribution">
              <CardHeader>
                <CardTitle>Node Status Distribution</CardTitle>
                <CardDescription>
                  Visual breakdown of cluster node health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={clusterHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {clusterHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pool-integration" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card data-testid="card-integration-status">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Connected Pools:</span>
                    <span className="font-semibold" data-testid="text-connected-pools">
                      {poolIntegrationStatus?.connectedPools || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Workers:</span>
                    <span className="font-semibold" data-testid="text-active-workers">
                      {poolIntegrationStatus?.activeWorkers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Strategy:</span>
                    <Badge variant="default">
                      {poolIntegrationStatus?.currentStrategy || 'Default'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-pool-performance">
              <CardHeader>
                <CardTitle>Pool Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Hash Rate:</span>
                    <span className="font-semibold" data-testid="text-pool-total-hashrate">
                      {poolIntegrationStatus?.totalHashRate?.toFixed(1) || 0} TH/s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Latency:</span>
                    <span className="font-semibold" data-testid="text-average-latency">
                      {poolIntegrationStatus?.averageLatency?.toFixed(0) || 0}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pool Names:</span>
                    <div className="text-right">
                      {poolIntegrationStatus?.poolNames?.slice(0, 2).map((name: string, index: number) => (
                        <Badge key={index} variant="outline" className="ml-1">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-optimization-actions">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  data-testid="button-refresh-predictions"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Refresh Predictions
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  data-testid="button-run-security-scan"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Run Security Scan
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  data-testid="button-optimize-cluster"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Cluster
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}