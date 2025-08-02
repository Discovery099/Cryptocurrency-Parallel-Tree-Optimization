import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle, 
  X,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  source?: string;
  sourceId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  isResolved: boolean;
  createdAt: string;
}

export default function SystemAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { lastMessage } = useWebSocket();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const { data: alertsData, isLoading } = useQuery({
    queryKey: ['/api/alerts'],
    queryParams: { limit: 10 },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => apiRequest('DELETE', '/api/alerts', {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setAlerts([]);
      toast({
        title: "Alerts Cleared",
        description: "All alerts have been cleared successfully.",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (alertId: string) => 
      apiRequest('PUT', `/api/alerts/${alertId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    },
  });

  useEffect(() => {
    if (alertsData) {
      setAlerts(alertsData);
    }
  }, [alertsData]);

  useEffect(() => {
    if (lastMessage?.event === 'new_alert') {
      const newAlert = lastMessage.data;
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }
    
    if (lastMessage?.event === 'alerts_cleared') {
      setAlerts([]);
    }
  }, [lastMessage]);

  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  const getAlertBorderColor = (type: string, severity: string) => {
    if (severity === 'critical') return 'border-red-500/20 bg-red-500/10';
    switch (type) {
      case 'error':
        return 'border-red-500/20 bg-red-500/10';
      case 'warning':
        return 'border-amber-500/20 bg-amber-500/10';
      case 'success':
        return 'border-emerald-500/20 bg-emerald-500/10';
      default:
        return 'border-blue-500/20 bg-blue-500/10';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    markAsReadMutation.mutate(alertId);
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const alertTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="system-alerts">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-50">Recent Alerts</h3>
        {alerts.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearAllMutation.mutate()}
            disabled={clearAllMutation.isPending}
            className="text-slate-400 hover:text-white text-xs"
            data-testid="button-clear-alerts"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-400">No active alerts</p>
            <p className="text-slate-500 text-sm">System is running smoothly</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start space-x-3 p-3 rounded-lg border ${getAlertBorderColor(alert.type, alert.severity)} ${
                !alert.isRead ? 'ring-1 ring-blue-500/20' : ''
              }`}
              data-testid={`alert-${alert.id}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type, alert.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-slate-50" data-testid={`alert-title-${alert.id}`}>
                      {alert.title}
                    </h4>
                    <Badge className={getSeverityBadgeColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {!alert.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                        data-testid={`mark-read-${alert.id}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-slate-300 mb-2" data-testid={`alert-message-${alert.id}`}>
                  {alert.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400" data-testid={`alert-time-${alert.id}`}>
                    {formatTimeAgo(alert.createdAt)}
                  </span>
                  
                  {alert.source && (
                    <span className="text-xs text-slate-500 capitalize">
                      {alert.source}
                      {alert.sourceId && ` • ${alert.sourceId.slice(0, 8)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* System Health Summary */}
      <div className="mt-6 p-4 bg-slate-700 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-200 text-sm font-medium">System Health</span>
          <span className="text-emerald-400 text-sm" data-testid="system-health">
            Excellent
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-slate-400">CPU</div>
            <div className="text-white" data-testid="system-cpu">34%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Memory</div>
            <div className="text-white" data-testid="system-memory">67%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400">Storage</div>
            <div className="text-white" data-testid="system-storage">42%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
