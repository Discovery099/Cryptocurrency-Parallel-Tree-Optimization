import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change?: number;
  status?: string;
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'red';
  'data-testid'?: string;
}

const colorClasses = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-400',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-400',
  red: 'bg-red-500/10 text-red-400',
};

const iconColorClasses = {
  emerald: 'text-emerald-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  amber: 'text-amber-400',
  red: 'text-red-400',
};

export default function MetricsCard({ 
  title, 
  value, 
  change, 
  status, 
  icon: Icon, 
  color,
  'data-testid': testId 
}: MetricsCardProps) {
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card className="bg-slate-800 border-slate-700 metric-card" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-slate-50" data-testid={`${testId}-value`}>
              {value}
            </p>
            {change !== undefined ? (
              <div className="flex items-center space-x-1 mt-1">
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : isNegativeChange ? (
                  <TrendingDown className="h-3 w-3 text-red-400" />
                ) : null}
                <span 
                  className={`text-sm ${
                    isPositiveChange ? 'text-emerald-400' : 
                    isNegativeChange ? 'text-red-400' : 'text-slate-400'
                  }`}
                  data-testid={`${testId}-change`}
                >
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
              </div>
            ) : status ? (
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-emerald-400 text-sm" data-testid={`${testId}-status`}>
                  {status}
                </span>
              </div>
            ) : null}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
