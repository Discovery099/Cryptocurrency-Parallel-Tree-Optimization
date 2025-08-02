import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: 'default' | 'emerald' | 'blue' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  label?: string;
}

const colorClasses = {
  default: 'bg-primary',
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export default function ProgressBar({
  value,
  max = 100,
  className,
  color = 'default',
  size = 'md',
  showValue = false,
  label,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm mb-1">
          {label && <span className="text-slate-400">{label}</span>}
          {showValue && <span className="text-slate-50">{value}{max === 100 ? '%' : `/${max}`}</span>}
        </div>
      )}
      <div className={cn(
        "w-full bg-slate-700 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "progress-bar rounded-full transition-all duration-500 ease-out",
            colorClasses[color],
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
