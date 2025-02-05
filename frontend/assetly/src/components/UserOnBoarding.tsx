'use client';
import { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import MaxWidthWrapper from './MaxWidthWrapper';
import { Card } from './ui/card';

const UserOnboarding = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const router = useRouter();

  const countries = [
    {
      id: 'nigeria',
      title: 'Nigeria',
      description: 'Access Nigerian Real World Assets',
      icon: 'https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/nigeria-flag-icon.png',
      image: 'https://cdn.vanguardngr.com/wp-content/uploads/2024/12/image-5.png'
    },
    {
      id: 'ghana',
      title: 'Ghana',
      description: 'Explore Ghanaian Real World Assets',
      icon: 'https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/ghana-flag-icon.png',
      image: 'https://tracextech.com/wp-content/uploads/2024/06/Cocoa-Traceability-Challenges.png'
    },
    {
      id: 'kenya',
      title: 'Kenya',
      description: 'Discover Kenyan Real World Assets',
      icon: 'https://w1.pngwing.com/pngs/844/356/png-transparent-background-green-kenya-flag-of-kenya-national-flag-red-symbol-rectangle.png',
      image: 'https://mynified.ca/cdn/shop/collections/DIGESTIVE_TEA.png?v=1665202296'
    }
  ];

  const handleCountrySelect = (countryId: string) => {
    setSelectedCountry(countryId);
    // Navigate to the RWA assets page with the selected country as a query parameter
    router.push(`/rwa-assets?country=${countryId}`);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <MaxWidthWrapper>
        <div className="py-16">
          <div className="space-y-8">
            <div className="text-center text-white">
              <h1 className="text-3xl font-bold mb-3">Select Your Region</h1>
              <p className="text-gray-300">Choose a country to view available real world assets</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {countries.map((country) => {
                const Icon = country.icon;
                return (
                  <Card
                    key={country.id}
                    className={`relative p-8 py-11 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedCountry === country.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => handleCountrySelect(country.id)}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-purple-100">
                      <Image
                          src={Icon}
                          alt={country.title}
                          width={40}
                          height={40}
                          className="object-contain rounded-lg w-8 h-8"
                          priority={true}
                          unoptimized={true}
                        />
                      </div>
                      <h3 className="text-xl font-semibold">{country.title}</h3>
                      <p className="text-gray-600 text-sm">{country.description}</p>
                      <div className="relative w-full h-32">
                        <Image
                          src={country.image}
                          alt={country.title}
                          className="object-cover rounded-lg"
                          fill
                          priority={true}
                          unoptimized={true}
                        />
                      </div>
                      <ChevronRight className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default UserOnboarding;