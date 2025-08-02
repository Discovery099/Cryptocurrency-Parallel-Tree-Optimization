interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: any;
  source?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 10000; // Keep last 10k logs in memory
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: string, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }
    
    return `${prefix} ${message}`;
  }

  private addLog(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      source: this.getCallerInfo(),
    };

    this.logs.push(logEntry);

    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private getCallerInfo(): string {
    const stack = new Error().stack;
    if (!stack) return 'unknown';

    const lines = stack.split('\n');
    // Skip the first 3 lines (Error, getCallerInfo, addLog, actual log method)
    const callerLine = lines[4];
    if (!callerLine) return 'unknown';

    // Extract file name and line number
    const match = callerLine.match(/at .* \((.+):(\d+):\d+\)/);
    if (match) {
      const filePath = match[1];
      const fileName = filePath.split('/').pop() || filePath;
      const lineNumber = match[2];
      return `${fileName}:${lineNumber}`;
    }

    return 'unknown';
  }

  info(message: string, context?: any): void {
    this.addLog('info', message, context);
    
    if (this.isDevelopment || process.env.LOG_LEVEL === 'debug') {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: any): void {
    this.addLog('warn', message, context);
    
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: any): void {
    this.addLog('error', message, context);
    
    console.error(this.formatMessage('error', message, context));
  }

  debug(message: string, context?: any): void {
    this.addLog('debug', message, context);
    
    if (this.isDevelopment || process.env.LOG_LEVEL === 'debug') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 100, level?: 'info' | 'warn' | 'error' | 'debug'): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-count);
  }

  // Get logs within a time range
  getLogsByTimeRange(start: Date, end: Date): LogEntry[] {
    return this.logs.filter(log => 
      log.timestamp >= start && log.timestamp <= end
    );
  }

  // Get error statistics
  getErrorStats(): { total: number; bySource: Record<string, number>; recent: number } {
    const errors = this.logs.filter(log => log.level === 'error');
    const recentErrors = errors.filter(log => 
      Date.now() - log.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    const bySource: Record<string, number> = {};
    errors.forEach(error => {
      const source = error.source || 'unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });

    return {
      total: errors.length,
      bySource,
      recent: recentErrors.length,
    };
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Structured logging for specific events
  logPerformance(operation: string, duration: number, metadata?: any): void {
    this.info(`Performance: ${operation}`, {
      duration: `${duration}ms`,
      ...metadata,
    });
  }

  logSecurity(event: string, details: any): void {
    this.warn(`Security: ${event}`, details);
  }

  logTransaction(txId: string, details: any): void {
    this.info(`Transaction: ${txId}`, details);
  }

  logGPU(gpuId: string, event: string, details: any): void {
    this.info(`GPU[${gpuId}]: ${event}`, details);
  }

  logMiningPool(poolName: string, event: string, details: any): void {
    this.info(`Pool[${poolName}]: ${event}`, details);
  }

  // Clear old logs (useful for long-running processes)
  clearOldLogs(olderThanHours: number = 24): number {
    const cutoffTime = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    const initialCount = this.logs.length;
    
    this.logs = this.logs.filter(log => log.timestamp >= cutoffTime);
    
    const clearedCount = initialCount - this.logs.length;
    
    if (clearedCount > 0) {
      this.info(`Cleared ${clearedCount} old log entries`);
    }
    
    return clearedCount;
  }

  // Export logs for analysis
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.logs, null, 2);
    }
    
    // CSV format
    const headers = ['timestamp', 'level', 'message', 'source', 'context'];
    const csvRows = [headers.join(',')];
    
    this.logs.forEach(log => {
      const row = [
        log.timestamp.toISOString(),
        log.level,
        `"${log.message.replace(/"/g, '""')}"`, // Escape quotes
        log.source || '',
        log.context ? `"${JSON.stringify(log.context).replace(/"/g, '""')}"` : '',
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}

// Create singleton instance
export const logger = new Logger();

// Export for testing or alternative usage
export { Logger };
