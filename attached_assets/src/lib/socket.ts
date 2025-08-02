import { Server } from 'socket.io';

export interface MerkleProgressUpdate {
  type: 'progress' | 'node_computed' | 'tree_complete' | 'error'
  progress: number
  currentNode?: {
    id: string
    level: number
    hash: string
  }
  computedNodes?: number
  totalNodes?: number
  message?: string
  timestamp: string
}

export interface BenchmarkUpdate {
  type: 'benchmark_start' | 'benchmark_progress' | 'benchmark_complete'
  currentSize?: number
  totalSizes?: number
  currentIteration?: number
  totalIterations?: number
  results?: any[]
  timestamp: string
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle Merkle tree computation progress
    socket.on('merkle_compute_start', (data: { transactionCount: number, config: any }) => {
      console.log('Merkle computation started:', data);
      
      // Simulate progress updates
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          
          // Send completion message
          socket.emit('merkle_update', {
            type: 'tree_complete',
            progress: 100,
            message: 'Merkle tree computation completed',
            timestamp: new Date().toISOString()
          } as MerkleProgressUpdate);
        } else {
          // Send progress update
          socket.emit('merkle_update', {
            type: 'progress',
            progress: Math.min(progress, 99),
            message: `Computing Merkle tree... ${Math.round(progress)}%`,
            timestamp: new Date().toISOString()
          } as MerkleProgressUpdate);
        }
      }, 200);
    });

    // Handle benchmark progress
    socket.on('benchmark_start', (data: { sizes: number[], iterations: number, config: any }) => {
      console.log('Benchmark started:', data);
      
      const { sizes, iterations } = data;
      let currentSizeIndex = 0;
      let currentIteration = 0;
      
      const sendBenchmarkProgress = () => {
        if (currentSizeIndex >= sizes.length) {
          // Benchmark complete
          socket.emit('benchmark_update', {
            type: 'benchmark_complete',
            results: [], // In real implementation, this would contain actual results
            timestamp: new Date().toISOString()
          } as BenchmarkUpdate);
          return;
        }
        
        const currentSize = sizes[currentSizeIndex];
        
        socket.emit('benchmark_update', {
          type: 'benchmark_progress',
          currentSize,
          totalSizes: sizes.length,
          currentIteration: currentIteration + 1,
          totalIterations: iterations,
          timestamp: new Date().toISOString()
        } as BenchmarkUpdate);
        
        currentIteration++;
        if (currentIteration >= iterations) {
          currentIteration = 0;
          currentSizeIndex++;
        }
        
        // Schedule next update
        setTimeout(sendBenchmarkProgress, 1000 + Math.random() * 2000);
      };
      
      // Start benchmark progress
      socket.emit('benchmark_update', {
        type: 'benchmark_start',
        timestamp: new Date().toISOString()
      } as BenchmarkUpdate);
      
      setTimeout(sendBenchmarkProgress, 1000);
    });

    // Handle real-time metrics subscription
    socket.on('subscribe_metrics', () => {
      console.log('Client subscribed to metrics');
      
      // Send periodic metrics updates
      const metricsInterval = setInterval(() => {
        if (socket.disconnected) {
          clearInterval(metricsInterval);
          return;
        }
        
        // Generate sample metrics
        const metrics = {
          computationTime: Math.random() * 100 + 10,
          throughput: Math.random() * 10000 + 1000,
          parallelEfficiency: Math.random() * 0.3 + 0.7,
          cacheHitRate: Math.random() * 0.2 + 0.8,
          gpuComputes: Math.floor(Math.random() * 1000),
          simdComputes: Math.floor(Math.random() * 500),
          memoryUsage: Math.random() * 100 + 10,
          timestamp: new Date().toISOString()
        };
        
        socket.emit('metrics_update', metrics);
      }, 2000);
      
      socket.on('unsubscribe_metrics', () => {
        clearInterval(metricsInterval);
        console.log('Client unsubscribed from metrics');
      });
    });

    // Handle configuration updates
    socket.on('config_update', (config: any) => {
      console.log('Configuration updated:', config);
      // Broadcast config update to all clients
      socket.broadcast.emit('config_update', config);
    });

    // Handle messages (legacy echo functionality)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Merkle Tree Optimization WebSocket!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};