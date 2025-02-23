'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CardPlaceholder, RegularCard } from '@/components/Cards';
import Header from '@/components/Header';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

// Define the type for our asset data
interface Asset {
  id: string;
  name: string;
  type: string;
  network: string;
  tokenType: string;
  price: number;
  country: string;
  image: string;
}

// Dummy data for assets
const dummyAssets: Asset[] = [
  {
    id: '1',
    name: 'Lagos Real Estate Fund',
    type: 'Real Estate',
    network: 'Celo',
    tokenType: 'Celo USDC',
    price: 50000,
    country: 'nigeria',
    image: 'https://i.pinimg.com/736x/db/bc/dd/dbbcddf042294ff0713cc5acdc3c43ef.jpg'
  },
  {
    id: '2',
    name: 'Accra Commercial Property',
    type: 'Commercial Property',
    network: 'Optimism',
    tokenType: 'Optimism USDC',
    price: 75000,
    country: 'ghana',
    image: 'https://a0.anyrgb.com/pngimg/1854/860/kwarleyz-apartments-wonda-world-estates-ascott-limited-oxford-street-accra-service-apartment-ghana-property-developer-tower-block-corporate-headquarters.png'
  },
  {
    id: '3',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
  {
    id: '4',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
  {
    id: '5',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
  {
    id: '6',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
  {
    id: '7',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
  {
    id: '8',
    name: 'Nairobi Tech Hub',
    type: 'Commercial Property',
    network: 'Ethereum',
    tokenType: 'USDT',
    price: 100000,
    country: 'kenya',
    image: 'https://visitnairobikenya.com/wp-content/uploads/2024/11/8.png'
  },
];

export default function RWAAssetsPage() {
  const searchParams = useSearchParams();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const country = searchParams.get('country');
    
    // Simulate API call with setTimeout
    setLoading(true);
    setTimeout(() => {
      const filteredAssets = country
        ? dummyAssets.filter(asset => asset.country === country)
        : dummyAssets;
      setAssets(filteredAssets);
      setLoading(false);
    }, 1000);
    
    // In a real application, you would fetch from an API:
    /*
    const fetchAssets = async () => {
      try {
        const response = await fetch(`/api/assets${country ? `?country=${country}` : ''}`);
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
    */
  }, [searchParams]);

  return (
    <MaxWidthWrapper>
        <div className="container mx-auto py-8 mb-40 -mt-20">
        <Header />
      <h1 className="text-3xl font-bold mb-8 mt-10">Real World Assets</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <CardPlaceholder key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <Link 
              href={`/dashboard/rwa-asset/${asset.id}`} 
              key={asset.id}
              className="hover:opacity-90 transition-opacity"
            >
              <RegularCard>
                <div className="relative aspect-square w-full">
                  <Image
                    src={asset.image}
                    alt={asset.name}
                    fill
                    className="object-cover"
                    priority={true}
                    unoptimized={true}
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold">{asset.name}</h3>
                  <p className="text-gray-600">{asset.type}</p>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Network: {asset.network}</p>
                      <p className="text-sm text-gray-500">Token: {asset.tokenType}</p>
                    </div>
                    <p className="text-base font-bold">Value: ${asset.price.toLocaleString()}</p>
                  </div>
                </div>
              </RegularCard>
            </Link>
          ))}
        </div>
      )}
    </div>
    </MaxWidthWrapper>
  );
}