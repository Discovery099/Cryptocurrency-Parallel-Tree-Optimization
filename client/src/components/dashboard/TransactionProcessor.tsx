import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bitcoin, Zap } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

interface TransactionStats {
  processed: number;
  pending: number;
  bitcoinTxPerSec: number;
  ethereumTxPerSec: number;
  bitcoinEfficiency: number;
  ethereumEfficiency: number;
  networkLoad: number;
}

export default function TransactionProcessor() {
  const [stats, setStats] = useState<TransactionStats>({
    processed: 12847,
    pending: 3924,
    bitcoinTxPerSec: 8432,
    ethereumTxPerSec: 4415,
    bitcoinEfficiency: 94.2,
    ethereumEfficiency: 91.8,
    networkLoad: 78,
  });

  const { data: transactionData } = useQuery({
    queryKey: ['/api/analytics/transactions', 1],
  });

  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.event === 'batch_processed') {
      const batch = lastMessage.data;
      setStats(prev => ({
        ...prev,
        processed: prev.processed + batch.batchSize,
        pending: Math.max(0, prev.pending - Math.floor(batch.batchSize * 0.1)),
      }));
    }
    
    if (lastMessage?.event === 'metrics_update') {
      const metrics = lastMessage.data;
      setStats(prev => ({
        ...prev,
        processed: metrics.transactionsProcessed || prev.processed,
        pending: metrics.transactionsPending || prev.pending,
        networkLoad: metrics.networkLoad || prev.networkLoad,
      }));
    }
  }, [lastMessage]);

  return (
    <div className="space-y-6" data-testid="transaction-processor">
      {/* Transaction Counters */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400" data-testid="transactions-processed">
              {stats.processed.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Transactions/sec</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-700 border-slate-600">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400" data-testid="transactions-pending">
              {stats.pending.toLocaleString()}
            </div>
            <div className="text-sm text-slate-400">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Network Processing */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Bitcoin className="text-blue-400 h-4 w-4" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Bitcoin Network</div>
              <div className="text-xs text-slate-400" data-testid="bitcoin-processing">
                Processing: {stats.bitcoinTxPerSec.toLocaleString()} tx/s
              </div>
            </div>
          </div>
          <div className="text-emerald-400 text-sm" data-testid="bitcoin-efficiency">
            {stats.bitcoinEfficiency}%
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Zap className="text-purple-400 h-4 w-4" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Ethereum Network</div>
              <div className="text-xs text-slate-400" data-testid="ethereum-processing">
                Processing: {stats.ethereumTxPerSec.toLocaleString()} tx/s
              </div>
            </div>
          </div>
          <div className="text-emerald-400 text-sm" data-testid="ethereum-efficiency">
            {stats.ethereumEfficiency}%
          </div>
        </div>
      </div>

      {/* Network Load */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">Network Load</span>
          <span className="text-white" data-testid="network-load">
            {stats.networkLoad}%
          </span>
        </div>
        <Progress 
          value={stats.networkLoad} 
          className="h-2"
        />
      </div>

      {/* Real-time Updates Indicator */}
      <div className="flex items-center justify-center text-xs text-slate-400">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2" />
        Real-time processing active
      </div>
    </div>
  );
}
