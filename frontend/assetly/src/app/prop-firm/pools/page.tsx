/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useParticleAuth } from '@/lib/hooks/useParticleAuth';
import CreatePoolForm from '@/components/CreatePoolForm';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';




interface Pool {
  id: string;
  totalAmount: number;
  allocatedAmount: number;
  tradersCount: number;
  performance: number;
  status: 'active' | 'full' | 'closed';
  createdAt: number;
  minAllocation: number;
  maxAllocation: number;
  riskLevel: number;
}

interface AllocationRequest {
  id: string;
  traderAddress: string;
  experience: string;
  requestedAmount: number;
  strategy: string;
  timestamp: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Simulate API delay
const OPERATION_DELAY = 1000;

// Mock data generators
const generateMockPools = (): Pool[] => [
  {
    id: '1',
    totalAmount: 500000,
    allocatedAmount: 300000,
    tradersCount: 15,
    performance: 12.5,
    status: 'active',
    createdAt: Date.now() - 2592000000,
    minAllocation: 10000,
    maxAllocation: 50000,
    riskLevel: 2
  },
  {
    id: '2',
    totalAmount: 250000,
    allocatedAmount: 250000,
    tradersCount: 10,
    performance: 8.2,
    status: 'full',
    createdAt: Date.now() - 5184000000,
    minAllocation: 5000,
    maxAllocation: 25000,
    riskLevel: 3
  },
  {
    id: '3',
    totalAmount: 750000,
    allocatedAmount: 450000,
    tradersCount: 20,
    performance: 15.8,
    status: 'active',
    createdAt: Date.now() - 1296000000,
    minAllocation: 15000,
    maxAllocation: 75000,
    riskLevel: 1
  }
];

const generateMockRequests = (): AllocationRequest[] => [
  {
    id: '1',
    traderAddress: '0xabcd...1234',
    experience: 'intermediate',
    requestedAmount: 25000,
    strategy: 'Swing Trading',
    timestamp: Date.now() - 86400000,
    status: 'pending'
  },
  {
    id: '2',
    traderAddress: '0xefgh...5678',
    experience: 'advanced',
    requestedAmount: 50000,
    strategy: 'Day Trading',
    timestamp: Date.now() - 43200000,
    status: 'pending'
  },
  {
    id: '3',
    traderAddress: '0xjdrf...2609',
    experience: 'beginner',
    requestedAmount: 100,
    strategy: 'Day Trading',
    timestamp: Date.now() - 73200000,
    status: 'pending'
  }
];

export default function PoolManagementPage() {
  const { address, isConnected } = useParticleAuth();
  const [pools, setPools] = useState<Pool[]>([]);
  const [newPoolAmount, setNewPoolAmount] = useState('');
  const [minAllocation, setMinAllocation] = useState('');
  const [maxAllocation, setMaxAllocation] = useState('');
  const [riskLevel, setRiskLevel] = useState('1');
  const [allocationRequests, setAllocationRequests] = useState<AllocationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [showNewPoolDialog, setShowNewPoolDialog] = useState(false);

  const loadPools = async () => {
    try {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, OPERATION_DELAY));
      
      setPools(generateMockPools());
      setAllocationRequests(generateMockRequests());
    } catch (error) {
      console.error('Failed to load pools:', error);
      toast.error('Failed to load pool data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      loadPools();
    }
  }, [isConnected, address]);

  const createPool = async () => {
    if (!newPoolAmount || !minAllocation || !maxAllocation) {
      toast.error('Please fill all required fields');
      return;
    }

    if (Number(minAllocation) >= Number(maxAllocation)) {
      toast.error('Minimum allocation must be less than maximum allocation');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate pool creation delay
      await new Promise(resolve => setTimeout(resolve, OPERATION_DELAY));

      const newPool: Pool = {
        id: Date.now().toString(),
        totalAmount: Number(newPoolAmount),
        allocatedAmount: 0,
        tradersCount: 0,
        performance: 0,
        status: 'active',
        createdAt: Date.now(),
        minAllocation: Number(minAllocation),
        maxAllocation: Number(maxAllocation),
        riskLevel: Number(riskLevel)
      };

      setPools(currentPools => [newPool, ...currentPools]);
      toast.success('Pool created successfully');
      setShowNewPoolDialog(false);
      setNewPoolAmount('');
      setMinAllocation('');
      setMaxAllocation('');
      setRiskLevel('1');
    } catch (error) {
      console.error('Failed to create pool:', error);
      toast.error('Failed to create pool');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllocationRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    setIsLoading(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, OPERATION_DELAY));

      setAllocationRequests(requests =>
        requests.map(request =>
          request.id === requestId ? { ...request, status } : request
        )
      );

      // If approved, update pool allocated amount
      if (status === 'approved') {
        const request = allocationRequests.find(r => r.id === requestId);
        if (request) {
          setPools(currentPools =>
            currentPools.map(pool =>
              pool.id === '1' ? {
                ...pool,
                allocatedAmount: pool.allocatedAmount + request.requestedAmount,
                tradersCount: pool.tradersCount + 1
              } : pool
            )
          );
        }
      }

      toast.success(`Request ${status} successfully`);
    } catch (error) {
      console.error('Failed to handle allocation request:', error);
      toast.error('Failed to process request');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="p-6">
        <Header />
        <Alert>
          <AlertDescription>
            Please connect your wallet to manage prop firm pools.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 mb-32">
      {/* Header */}
      <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/prop-firm')}
              className="mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Prop Firm</h1>
          </div>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Pool Management</h1>
              <Button onClick={() => setShowNewPoolDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Pool
              </Button>
          </div>

      <CreatePoolForm
        isOpen={showNewPoolDialog}
        onClose={() => setShowNewPoolDialog(false)}
        onSubmit={async (poolData) => {
          if (!poolData.totalAmount || !poolData.minAllocation || !poolData.maxAllocation) {
            toast.error('Please fill all required fields');
            return;
          }

          if (Number(poolData.minAllocation) >= Number(poolData.maxAllocation)) {
            toast.error('Minimum allocation must be less than maximum allocation');
            return;
          }

          setIsLoading(true);
          try {
            await new Promise(resolve => setTimeout(resolve, OPERATION_DELAY));

            const newPool: Pool = {
              id: Date.now().toString(),
              totalAmount: Number(poolData.totalAmount),
              allocatedAmount: 0,
              tradersCount: 0,
              performance: 0,
              status: 'active',
              createdAt: Date.now(),
              minAllocation: Number(poolData.minAllocation),
              maxAllocation: Number(poolData.maxAllocation),
              riskLevel: Number(poolData.riskLevel)
            };

            setPools(currentPools => [newPool, ...currentPools]);
            toast.success('Pool created successfully');
            setShowNewPoolDialog(false);
          } catch (error) {
            console.error('Failed to create pool:', error);
            toast.error('Failed to create pool');
          } finally {
            setIsLoading(false);
          }
        }}
        isLoading={isLoading}
      />

      {/* Active Pools */}
      <Card>
        <CardHeader>
          <CardTitle>Active Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="border-2">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold">${pool.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Allocated</p>
                      <p className="text-lg font-bold">${pool.allocatedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Active Traders</p>
                      <p className="text-lg font-bold">{pool.tradersCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Performance</p>
                      <p className={`text-lg font-bold ${
                        pool.performance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {pool.performance}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Min Allocation</p>
                      <p className="text-sm font-medium">${pool.minAllocation.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Max Allocation</p>
                      <p className="text-sm font-medium">${pool.maxAllocation.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Risk Level</p>
                      <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-full rounded ${
                              i < pool.riskLevel ? 'bg-yellow-400' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pool.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : pool.status === 'full'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {pool.status.charAt(0).toUpperCase() + pool.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allocation Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Allocation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allocationRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Trader: {request.traderAddress}</p>
                    <p className="text-sm text-gray-500">Experience: {request.experience}</p>
                    <p className="text-sm text-gray-500">Strategy: {request.strategy}</p>
                  </div>
                  <p className="font-medium">${request.requestedAmount.toLocaleString()}</p>
                </div>
                {request.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAllocationRequest(request.id, 'approved')}
                      disabled={isLoading}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAllocationRequest(request.id, 'rejected')}
                      disabled={isLoading}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {allocationRequests.length === 0 && (
              <Alert>
                <AlertDescription>
                  No pending allocation requests.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}