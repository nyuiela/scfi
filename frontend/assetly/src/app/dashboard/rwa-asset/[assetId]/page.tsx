'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Wallet, Network } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface AssetDetail {
  id: string;
  name: string;
  type: string;
  network: string;
  tokenType: string;
  price: number;
  country: string;
  image: string;
  description: string;
  location: string;
  yearBuilt?: number;
  totalSupply: number;
  minimumInvestment: number;
  expectedReturn: number;
  lockupPeriod: string;
  assetManager: string;
  documents: {
    title: string;
    url: string;
  }[];
  riskLevel: 'Low' | 'Medium' | 'High';
  lastValuation: string;
  propertyDetails?: {
    size: string;
    occupancyRate?: number;
    tenants?: number;
  };
}

// Expanded dummy data with more details
const dummyAssetDetails: Record<string, AssetDetail> = {
  '1': {
    id: '1',
    name: 'Lagos Real Estate Fund',
    type: 'Real Estate',
    network: 'Celo',
    tokenType: 'Celo USDC',
    price: 50000,
    country: 'nigeria',
    image: '/lagos-estate.jpg',
    description: 'A premium commercial real estate investment opportunity in the heart of Lagos Business District. This property offers stable returns through a diversified tenant base and strategic location.',
    location: 'Victoria Island, Lagos',
    yearBuilt: 2019,
    totalSupply: 1000000,
    minimumInvestment: 500,
    expectedReturn: 12.5,
    lockupPeriod: '12 months',
    assetManager: 'Lagos Property Partners Ltd',
    documents: [
      { title: 'Legal Documentation', url: '/docs/legal.pdf' },
      { title: 'Financial Reports', url: '/docs/financial.pdf' },
      { title: 'Property Assessment', url: '/docs/assessment.pdf' }
    ],
    riskLevel: 'Medium',
    lastValuation: '2024-01-15',
    propertyDetails: {
      size: '2,500 sqm',
      occupancyRate: 95,
      tenants: 12
    }
  },
  // Add more assets as needed
};

export default function AssetDetailPage() {
  const params = useParams();
  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssetDetails = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          // Type-safe extraction of assetId
          const assetId = Array.isArray(params.id) 
            ? params.id[0] 
            : params.id || '';
          
          const assetData = dummyAssetDetails[assetId];
          setAsset(assetData);
          setLoading(false);
        }, 1000);

        // In a real application, you would fetch from an API:
        /*
        const response = await fetch(`/api/assets/${assetId}`);
        const data = await response.json();
        setAsset(data);
        */
      } catch (error) {
        console.error('Error fetching asset details:', error);
        setLoading(false);
      }
    };

    // Only call fetchAssetDetails if params.id exists
    if (params.id) {
      fetchAssetDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Asset Not Found</h2>
          <Link href="/dashboard/rwa-assets" className="text-blue-600 hover:underline">
            Return to Assets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link 
        href="/dashboard/rwa-assets" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Assets
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square w-full rounded-lg overflow-hidden">
          <Image
            src={asset.image}
            alt={asset.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{asset.name}</h1>
            <p className="text-gray-600">{asset.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Price</span>
              </div>
              <p className="text-2xl font-bold">${asset.price.toLocaleString()}</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Network className="w-5 h-5 text-purple-600" />
                <span className="font-semibold">Network</span>
              </div>
              <p className="text-lg">{asset.network}</p>
            </Card>
          </div>

          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-600">Minimum Investment</p>
                <p className="font-semibold">${asset.minimumInvestment.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Expected Return</p>
                <p className="font-semibold">{asset.expectedReturn}% APY</p>
              </div>
              <div>
                <p className="text-gray-600">Lock-up Period</p>
                <p className="font-semibold">{asset.lockupPeriod}</p>
              </div>
              <div>
                <p className="text-gray-600">Risk Level</p>
                <p className="font-semibold">{asset.riskLevel}</p>
              </div>
            </div>
          </Card>

          {asset.propertyDetails && (
            <Card className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <p className="text-gray-600">Property Size</p>
                  <p className="font-semibold">{asset.propertyDetails.size}</p>
                </div>
                <div>
                  <p className="text-gray-600">Occupancy Rate</p>
                  <p className="font-semibold">{asset.propertyDetails.occupancyRate}%</p>
                </div>
                <div>
                  <p className="text-gray-600">Number of Tenants</p>
                  <p className="font-semibold">{asset.propertyDetails.tenants}</p>
                </div>
                <div>
                  <p className="text-gray-600">Year Built</p>
                  <p className="font-semibold">{asset.yearBuilt}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Documents</h2>
            <div className="space-y-2">
              {asset.documents.map((doc) => (
                <a
                  key={doc.title}
                  href={doc.url}
                  className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {doc.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}