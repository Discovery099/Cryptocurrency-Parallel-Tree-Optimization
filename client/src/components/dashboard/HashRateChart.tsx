import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function HashRateChart() {
  const [timeRange, setTimeRange] = useState("24h");

  const { data: chartData, isLoading } = useQuery({
    queryKey: ['/api/dashboard/chart-data', timeRange],
  });

  // Sample data for when real data is loading
  const sampleData = [
    { timestamp: '00:00', hashRate: 320, efficiency: 94, temperature: 67, power: 7800 },
    { timestamp: '04:00', hashRate: 335, efficiency: 95, temperature: 69, power: 8100 },
    { timestamp: '08:00', hashRate: 342, efficiency: 94, temperature: 71, power: 8250 },
    { timestamp: '12:00', hashRate: 338, efficiency: 93, temperature: 73, power: 8180 },
    { timestamp: '16:00', hashRate: 345, efficiency: 96, temperature: 70, power: 8300 },
    { timestamp: '20:00', hashRate: 342, efficiency: 95, temperature: 68, power: 8200 },
    { timestamp: '24:00', hashRate: 347, efficiency: 97, temperature: 66, power: 8350 },
  ];

  const displayData = chartData || sampleData;

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="hashrate-chart">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-50">Performance Overview</h3>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === '24h' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('24h')}
            className="text-xs"
            data-testid="button-24h"
          >
            24H
          </Button>
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
            className="text-xs"
            data-testid="button-7d"
          >
            7D
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
            className="text-xs"
            data-testid="button-30d"
          >
            30D
          </Button>
        </div>
      </div>
      
      <div className="h-64 hash-rate-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1E293B', 
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#F1F5F9'
              }}
              labelStyle={{ color: '#94A3B8' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="hashRate" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Hash Rate (TH/s)"
              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="efficiency" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Efficiency (%)"
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
