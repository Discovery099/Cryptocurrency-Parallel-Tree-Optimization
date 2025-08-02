'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'

// Import advanced components
import RealTimeVisualization from '@/components/merkle/RealTimeVisualization'
import MerkleTreeVisualization from '@/components/merkle/MerkleTreeVisualization'
import AdvancedConfig from '@/components/merkle/AdvancedConfig'
import BenchmarkAnalysis from '@/components/merkle/BenchmarkAnalysis'

interface MerkleNode {
  id: string
  hash: string
  level: number
  position: number
  leftChild?: string
  rightChild?: string
  parent?: string
  computed: boolean
  processing?: boolean
}

interface MerkleTree {
  root: string
  nodes: MerkleNode[]
  levels: number
  leafCount: number
}

interface PerformanceMetrics {
  computationTime: number
  throughput: number
  parallelEfficiency: number
  cacheHitRate: number
  gpuComputes: number
  simdComputes: number
  totalNodes: number
  parallelNodes: number
  memoryUsage: number
}

interface AlgorithmConfig {
  threadCount: number
  enableGPU: boolean
  probabilisticMode: boolean
  errorRate: number
  enableSIMD: boolean
  workStealing: boolean
  batchSize: number
  streamingMode: boolean
  cacheSize: number
  bloomFilterSize: number
  optimizationStrategy: 'balanced' | 'speed' | 'memory' | 'accuracy'
  hashAlgorithm: 'sha256' | 'blake2b' | 'keccak256'
  memoryPattern: 'contiguous' | 'interleaved' | 'optimized'
}

export default function Home() {
  const [config, setConfig] = useState<AlgorithmConfig>({
    threadCount: 8,
    enableGPU: true,
    probabilisticMode: false,
    errorRate: 0.01,
    enableSIMD: true,
    workStealing: true,
    batchSize: 1000,
    streamingMode: false,
    cacheSize: 5000,
    bloomFilterSize: 50000,
    optimizationStrategy: 'balanced',
    hashAlgorithm: 'sha256',
    memoryPattern: 'contiguous'
  })

  const [merkleTree, setMerkleTree] = useState<MerkleTree | null>(null)
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isComputing, setIsComputing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transactionData, setTransactionData] = useState('')
  const [transactionCount, setTransactionCount] = useState(1000)
  const [benchmarkHistory, setBenchmarkHistory] = useState<any[]>([])
  const [realTimeMetrics, setRealTimeMetrics] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  const generateRandomTransactions = () => {
    const transactions = []
    for (let i = 0; i < transactionCount; i++) {
      const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      transactions.push(hash)
    }
    setTransactionData(transactions.join('\n'))
  }

  const computeMerkleTree = async () => {
    if (!transactionData.trim()) return

    setIsComputing(true)
    setProgress(0)
    
    try {
      const transactions = transactionData.trim().split('\n').filter(t => t.length > 0)
      
      // Simulate real-time progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + Math.random() * 15, 95))
      }, 200)

      const response = await fetch('/api/merkle/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          config
        })
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.ok) {
        const result = await response.json()
        setMerkleTree(result.tree)
        setMetrics(result.metrics)
        
        // Add to benchmark history
        setBenchmarkHistory(prev => [
          ...prev.slice(-9),
          {
            timestamp: new Date().toISOString(),
            size: transactions.length,
            ...result.metrics,
            config: { ...config }
          }
        ])
      }
    } catch (error) {
      console.error('Error computing Merkle tree:', error)
    } finally {
      setIsComputing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const startBenchmark = async () => {
    const sizes = [100, 1000, 10000, 100000]
    const results = []

    for (const size of sizes) {
      const transactions = Array.from({ length: size }, () => 
        Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      )

      const response = await fetch('/api/merkle/compute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          config
        })
      })

      if (response.ok) {
        const result = await response.json()
        results.push({
          size,
          ...result.metrics
        })
      }
    }

    setBenchmarkHistory(results)
  }

  const startAdvancedBenchmark = async (benchmarkConfig: any) => {
    try {
      const response = await fetch('/api/merkle/benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: benchmarkConfig,
          sizes: [100, 1000, 10000, 50000],
          iterations: 3
        })
      })

      if (response.ok) {
        const results = await response.json()
        setBenchmarkHistory(prev => [...prev, ...results])
      }
    } catch (error) {
      console.error('Error running advanced benchmark:', error)
    }
  }

  useEffect(() => {
    generateRandomTransactions()
  }, [transactionCount])

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Cryptocurrency Parallel Tree Optimization
          </h1>
          <p className="text-xl text-muted-foreground">
            Advanced Merkle Tree Construction for High-Throughput Mining
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Computation Time</CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">⏱️</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${metrics.computationTime.toFixed(2)} ms` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {metrics ? `${(1000 / metrics.computationTime).toFixed(2)} ops/sec` : 'No data'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">📊</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${metrics.throughput.toFixed(0)} tx/s` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Transactions per second
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parallel Efficiency</CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">⚡</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${(metrics.parallelEfficiency * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CPU utilization efficiency
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">💾</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics ? `${(metrics.cacheHitRate * 100).toFixed(1)}%` : 'N/A'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Memory cache efficiency
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Input</CardTitle>
                  <CardDescription>
                    Enter transaction hashes (one per line) or generate random data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={transactionCount}
                      onChange={(e) => setTransactionCount(Number(e.target.value))}
                      placeholder="Number of transactions"
                      min="1"
                      max="1000000"
                    />
                    <Button onClick={generateRandomTransactions} variant="outline">
                      Generate Random
                    </Button>
                  </div>
                  <Textarea
                    value={transactionData}
                    onChange={(e) => setTransactionData(e.target.value)}
                    placeholder="Enter transaction hashes (one per line)"
                    className="min-h-[200px] font-mono text-xs"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={computeMerkleTree} 
                      disabled={isComputing || !transactionData.trim()}
                      className="flex-1"
                    >
                      {isComputing ? 'Computing...' : 'Compute Merkle Tree'}
                    </Button>
                    <Button onClick={startBenchmark} variant="outline">
                      Run Benchmark
                    </Button>
                  </div>
                  {isComputing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <Progress value={progress} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Configuration</CardTitle>
                  <CardDescription>
                    Active algorithm parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Thread Count</Label>
                      <div className="text-sm font-mono">{config.threadCount}</div>
                    </div>
                    <div>
                      <Label>GPU Acceleration</Label>
                      <Badge variant={config.enableGPU ? "default" : "secondary"}>
                        {config.enableGPU ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div>
                      <Label>Probabilistic Mode</Label>
                      <Badge variant={config.probabilisticMode ? "default" : "secondary"}>
                        {config.probabilisticMode ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div>
                      <Label>SIMD Optimization</Label>
                      <Badge variant={config.enableSIMD ? "default" : "secondary"}>
                        {config.enableSIMD ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                  
                  {merkleTree && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Merkle Root</Label>
                        <div className="font-mono text-xs bg-muted p-2 rounded break-all">
                          {merkleTree.root}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Tree Levels: </span>
                            <span className="font-mono">{merkleTree.levels}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Leaf Nodes: </span>
                            <span className="font-mono">{merkleTree.leafCount}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <AdvancedConfig 
              config={config} 
              onConfigChange={setConfig}
            />
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <MerkleTreeVisualization 
              tree={merkleTree || undefined}
              showControls={true}
            />
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <RealTimeVisualization 
              onConfigUpdate={setConfig}
            />
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Benchmarks</CardTitle>
                  <CardDescription>
                    Computation time vs transaction count
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={benchmarkHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="size" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="computationTime" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Throughput Analysis</CardTitle>
                  <CardDescription>
                    Transactions per second by batch size
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={benchmarkHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="size" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="throughput" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Results</CardTitle>
                <CardDescription>
                  Detailed performance metrics for different transaction batch sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {benchmarkHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Transactions</th>
                          <th className="text-left p-2">Time (ms)</th>
                          <th className="text-left p-2">Throughput (tx/s)</th>
                          <th className="text-left p-2">Parallel Efficiency</th>
                          <th className="text-left p-2">Cache Hit Rate</th>
                          <th className="text-left p-2">GPU Computes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {benchmarkHistory.map((benchmark, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-mono">{benchmark.size?.toLocaleString() || 'N/A'}</td>
                            <td className="p-2 font-mono">{benchmark.computationTime?.toFixed(2) || 'N/A'}</td>
                            <td className="p-2 font-mono">{benchmark.throughput?.toFixed(0) || 'N/A'}</td>
                            <td className="p-2 font-mono">{benchmark.parallelEfficiency ? `${(benchmark.parallelEfficiency * 100).toFixed(1)}%` : 'N/A'}</td>
                            <td className="p-2 font-mono">{benchmark.cacheHitRate ? `${(benchmark.cacheHitRate * 100).toFixed(1)}%` : 'N/A'}</td>
                            <td className="p-2 font-mono">{benchmark.gpuComputes?.toLocaleString() || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No benchmark data available. Run a benchmark to see results.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <BenchmarkAnalysis 
              benchmarkData={benchmarkHistory}
              onRunBenchmark={startAdvancedBenchmark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}