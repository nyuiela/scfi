/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { aiMetrics, assets, countries } from '@/lib/dashboardData';
import { AssetCard } from '@/components/asset-card';
import Header from '@/components/Header';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import AIMetricsCard from '@/components/AIMetricsCard';



export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = React.useState('all');
  const [aiAgentMetrics, setAiAgentMetrics] = React.useState(aiMetrics);

  const filteredAssets = React.useMemo(() => {
    if (selectedCountry === 'all') return assets;
    return assets.filter(asset => asset.country === selectedCountry);
  }, [selectedCountry]);

  return (
    <MaxWidthWrapper className='mb-20'>
      <div className="p-6 space-y-6">
      <Header />
      {/* Account Balance Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Main Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Account Balance</h2>
              <p className="text-4xl font-bold">68,789.56 USD</p>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Transfer Money
                </Button>
                <Button variant="outline">Link Accounts</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Agents Section */}
        <Card className="bg-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg">AI Agents Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Monitor and manage your AI agents&apos; performance and tasks</p>
            <Button variant="secondary" className="text-emerald-600">
              View Agents <Bot className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Traded Assets Section */}
      <div className="grid gap-4 md:grid-cols-4">
        {['Gold/GH', 'Cotton/FR', 'Copper/ZM', 'Oil/NG'].map((asset, i) => (
          <AssetCard
            key={asset}
            title={asset.split('/')[0]}
            country={asset.split('/')[1]}
            value={((i + 1) * 12500).toFixed(2)}
            address={`0x${Math.random().toString(16).slice(2, 8)}`}
          />
        ))}
      </div>

      {/* Asset List Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Listed Assets</CardTitle>
            <Select
              value={selectedCountry}
              onValueChange={setSelectedCountry}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-gray-500">/{asset.country}</div>
                  </div>
                  <div className="text-sm font-medium">{asset.value} USD</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Metrics Section */}
        <AIMetricsCard 
          metrics={{
            daily: 275,
            weekly: 1420,
            monthly: 8200,
            completed: 8400,
            successRate: 85,
          }}
        />
        {/* <Card>
          <CardHeader>
            <CardTitle>AI Agent Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold">{aiAgentMetrics.active}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">{aiAgentMetrics.completed}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold">{aiAgentMetrics.successRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
    </MaxWidthWrapper>
    
  );
}

// import Header from "@/components/Header";
// import UserOnboarding from "@/components/UserOnBoarding";

// export default function Home() {
//   return (
//     <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
//       <Header />
//       <div className="flex flex-col gap-8 mb-20">
//         <div className="text-center pt-8 pb-4 -mb-24">
//           <h1 className="text-4xl font-bold text-white">WELCOME TO SCROLL/DeFAI</h1>
//         </div>
//         <UserOnboarding />
//       </div>
//     </div>
//   );
// }