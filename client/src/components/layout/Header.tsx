import { Bell, Clock, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const { data: unreadAlerts } = useQuery({
    queryKey: ['/api/alerts/unread'],
  });

  const { data: systemStatus } = useQuery({
    queryKey: ['/api/system/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toUTCString().split(' ')[4] + ' UTC';
  };

  const notificationCount = unreadAlerts?.length || 0;
  const isSystemOnline = systemStatus?.services?.miningEngine?.isRunning !== false;

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 header-gradient" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white" data-testid="page-title">
            Mining Operations Dashboard
          </h2>
          <p className="text-slate-400" data-testid="page-description">
            Real-time Merkle tree optimization and mining pool management
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* System Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isSystemOnline 
                ? 'bg-emerald-500 animate-pulse' 
                : 'bg-red-500'
            }`} />
            <span 
              className={`text-sm font-medium ${
                isSystemOnline ? 'text-emerald-400' : 'text-red-400'
              }`}
              data-testid="system-status"
            >
              {isSystemOnline ? 'All Systems Operational' : 'System Issues Detected'}
            </span>
          </div>
          
          {/* Real-time Clock */}
          <div className="flex items-center space-x-1 text-sm text-slate-300" data-testid="current-time">
            <Clock className="h-4 w-4" />
            <span>{formatTime(currentTime)}</span>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-1 text-sm text-slate-300" data-testid="connection-status">
            <Wifi className="h-4 w-4 text-emerald-400" />
            <span>Connected</span>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
              data-testid="notifications-button"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full p-0 min-w-[20px]"
                  data-testid="notification-count"
                >
                  {notificationCount > 99 ? '99+' : notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
