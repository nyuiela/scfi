import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MetricsData {
  daily: number;
  weekly: number;
  monthly: number;
  completed: number;
  successRate: number;
}

interface AIMetricsCardProps {
  metrics: MetricsData;
}

const AIMetricsCard: React.FC<AIMetricsCardProps> = ({ metrics }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Agent Metrics</CardTitle>
        <Select defaultValue="lastMonth">
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastMonth">Last month</SelectItem>
            <SelectItem value="thisMonth">This month</SelectItem>
            <SelectItem value="lastWeek">Last week</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">daily</p>
              <p className="text-2xl font-bold">{metrics.daily} <span className="text-lg">tasks</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">weekly</p>
              <p className="text-2xl font-bold">{metrics.weekly} <span className="text-lg">tasks</span></p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">monthly</p>
              <p className="text-2xl font-bold">{metrics.monthly} <span className="text-lg">tasks</span></p>
            </div>
          </div>
          
          <div className="relative pt-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-rose-500">Tasks Completed</p>
                    <p className="text-3xl font-bold">{metrics.completed} tasks</p>
                  </div>
                </div>
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-rose-500"
                    strokeDasharray={`${metrics.successRate * 7.54} 754`}
                  />
                </svg>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <span className="text-sm">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMetricsCard;