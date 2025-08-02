import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'connecting';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const statusConfig = {
  online: {
    color: 'bg-emerald-500',
    label: 'Online',
    animate: false,
  },
  offline: {
    color: 'bg-slate-500',
    label: 'Offline',
    animate: false,
  },
  warning: {
    color: 'bg-amber-500',
    label: 'Warning',
    animate: false,
  },
  error: {
    color: 'bg-red-500',
    label: 'Error',
    animate: false,
  },
  connecting: {
    color: 'bg-blue-500',
    label: 'Connecting',
    animate: true,
  },
};

const sizeClasses = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export default function StatusIndicator({
  status,
  size = 'md',
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          "rounded-full",
          sizeClasses[size],
          config.color,
          config.animate && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="text-sm text-slate-300">{config.label}</span>
      )}
    </div>
  );
}
