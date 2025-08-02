export interface Alert {
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
  resolvedAt?: string;
}

export interface AlertStats {
  total: number;
  unread: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
  bySource: Record<string, number>;
}

export interface AlertFilter {
  type?: 'info' | 'warning' | 'error' | 'success';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
  isRead?: boolean;
  isResolved?: boolean;
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface AlertConfiguration {
  enabled: boolean;
  minSeverity: 'low' | 'medium' | 'high' | 'critical';
  emailNotifications: boolean;
  webhookUrl?: string;
  autoResolveAfterHours: number;
  throttleMinutes: number;
}

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'info' | 'warning' | 'error' | 'success';
export type AlertSource = 'system' | 'gpu' | 'pool' | 'algorithm' | 'network';
