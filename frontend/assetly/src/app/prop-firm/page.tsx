"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Wallet, Users, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParticleAuth } from '@/lib/hooks/useParticleAuth';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';



interface PoolMetrics {
  totalFunds: number;
  activeTraders: number;
  averageAllocation: number;
  successRate: number;
  riskLevel: number;
}

interface TraderAllocation {
  address: string;
  allocation: number;
  performance: number;
  startDate: number;
  status: 'active' | 'warning' | 'terminated';
}

// Simulate API delay
const FETCH_DELAY = 1500;

// Mock data generators
const generateMockMetrics = (): PoolMetrics => ({
  totalFunds: 2500000,
  activeTraders: 45,
  averageAllocation: 55000,
  successRate: 72,
  riskLevel: 3
});

const generateMockAllocations = (): TraderAllocation[] => [
  {
    address: "0x1234...5678",
    allocation: 75000,
    performance: 18.5,
    startDate: Date.now() - 7776000000,
    status: 'active'
  },
  {
    address: "0x8765...4321",
    allocation: 50000,
    performance: -8.2,
    startDate: Date.now() - 2592000000,
    status: 'warning'
  },
  {
    address: "0x9876...5432",
    allocation: 100000,
    performance: 25.4,
    startDate: Date.now() - 5184000000,
    status: 'active'
  },
  {
    address: "0x4321...8765",
    allocation: 35000,
    performance: -12.8,
    startDate: Date.now() - 1296000000,
    status: 'terminated'
  }
];

export default function PropFirmOverview() {
  const { address, isConnected } = useParticleAuth();
  const [metrics, setMetrics] = useState<PoolMetrics>({
    totalFunds: 0,
    activeTraders: 0,
    averageAllocation: 0,
    successRate: 0,
    riskLevel: 0
  });
  const [allocations, setAllocations] = useState<TraderAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPropFirmData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, FETCH_DELAY));
      
      // Load mock data
      const mockMetrics = generateMockMetrics();
      const mockAllocations = generateMockAllocations();
      
      setMetrics(mockMetrics);
      setAllocations(mockAllocations);
    } catch (error) {
      console.error('Failed to load prop firm data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      loadPropFirmData();
    }
  }, [isConnected, address, loadPropFirmData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
            <Image
              src="https://i.imgur.com/IcF1dcF.png"
              alt="Loading"
              priority={true}
              unoptimized={true}
              width={128}
              height={128}
              className="animate-bounce rounded-full bg-fuchsia-700"
            />
          </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="p-6">
        <Header />
        <Alert>
          <AlertDescription>
            Please connect your wallet to access the prop firm dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const performanceData = [
    { name: 'Profitable', value: metrics.successRate },
    { name: 'Unprofitable', value: 100 - metrics.successRate }
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="p-6 space-y-6 mb-32">
      {/* Header */}
      <Header />
      <MaxWidthWrapper>
        <div className="p-6 space-y-6 mb-32">
      <div className="flex justify-between items-center">
        <div className='mt-10'>
          <h1 className="text-2xl font-bold">Prop Firm Overview</h1>
          <p className="text-gray-500 mt-1">Manage your prop firm pools and traders</p>
        </div>
        <Link href="/prop-firm/pools">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Pool
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Funds</p>
                <p className="text-2xl font-bold">${metrics.totalFunds.toLocaleString()}</p>
              </div>
              <Wallet className="h-5 w-5 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Active Traders</p>
                <p className="text-2xl font-bold">{metrics.activeTraders}</p>
              </div>
              <Users className="h-5 w-5 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">{metrics.successRate}%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Risk Level</p>
                <p className="text-2xl font-bold">{metrics.riskLevel}/5</p>
              </div>
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Average Allocation</p>
                <p className="text-xl font-bold">
                  ${metrics.averageAllocation.toLocaleString()}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Maximum Drawdown</p>
                <p className="text-xl font-bold text-red-600">-15%</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-gray-500">Risk Score</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded ${
                        i < metrics.riskLevel ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Allocations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Trader</th>
                  <th className="px-4 py-2 text-right">Allocation</th>
                  <th className="px-4 py-2 text-right">Performance</th>
                  <th className="px-4 py-2 text-left">Start Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((allocation, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">
                      <span className="font-mono">{allocation.address}</span>
                    </td>
                    <td className="px-4 py-2 text-right">
                      ${allocation.allocation.toLocaleString()}
                    </td>
                    <td className={`px-4 py-2 text-right ${
                      allocation.performance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {allocation.performance}%
                    </td>
                    <td className="px-4 py-2">
                      {new Date(allocation.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        allocation.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : allocation.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {allocation.status.charAt(0).toUpperCase() + allocation.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
      </MaxWidthWrapper>
    </div>
  );
}