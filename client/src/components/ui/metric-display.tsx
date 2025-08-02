import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricDisplayProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  icon?: LucideIcon;
  color?: 'default' | 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorClasses = {
  default: 'text-slate-50',
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
};

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export default function MetricDisplay({
  label,
  value,
  change,
  changeType = 'percentage',
  icon: Icon,
  color = 'default',
  size = 'md',
  className,
}: MetricDisplayProps) {
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  const formatChange = (change: number) => {
    if (changeType === 'percentage') {
      return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
    }
    return `${change > 0 ? '+' : ''}${change}`;
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className={cn(
          "font-bold",
          sizeClasses[size],
          colorClasses[color]
        )}>
          {value}
        </span>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            ) : isNegativeChange ? (
              <TrendingDown className="h-3 w-3 text-red-400" />
            ) : null}
            <span className={cn(
              "text-xs",
              isPositiveChange ? 'text-emerald-400' : 
              isNegativeChange ? 'text-red-400' : 'text-slate-400'
            )}>
              {formatChange(change)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
