"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, ImageIcon } from 'lucide-react';

const AssetCreationForm = () => {
  const router = useRouter();
  const [assetType, setAssetType] = React.useState<string>('');
  const [open, setOpen] = React.useState<boolean>(false);
  const [imagePreview, setImagePreview] = React.useState<string>('');

  const defaultAssetTypes = [
    'Real Estate',
    'Commodities',
    'Art',
    'Collectibles',
    'Infrastructure',
    'Equipment',
    'Intellectual Property'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setImagePreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just redirect to the listings page
    router.push('/listings');
  };

  return (
    <div className="container mx-auto p-2">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Asset Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="asset-image">Asset Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                  {imagePreview ? (
                    <Image 
                      src={imagePreview}
                      width={328}
                      height={328}
                      priority={true}
                      unoptimized={true} 
                      alt="Asset preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <Input
                  id="asset-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="max-w-xs"
                />
              </div>
            </div>

            {/* Asset Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input id="name" placeholder="Enter asset name" required />
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Asset Type</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {assetType || "Select asset type..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search asset type..." />
                    <CommandEmpty>No asset type found.</CommandEmpty>
                    <CommandGroup>
                      {defaultAssetTypes.map((type) => (
                        <CommandItem
                          key={type}
                          onSelect={(currentValue: string) => {
                            setAssetType(currentValue === assetType ? '' : currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              assetType === type ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your asset..." 
                className="min-h-[100px] resize-none"
                required={true}
              />
            </div>

            {/* Price Information */}
            <div className="space-y-2">
              <Label htmlFor="price">Initial Listing Price</Label>
              <div className="flex gap-2">
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0.00" 
                  min="0" 
                  step="0.01" 
                  required 
                />
                <Select defaultValue="USD">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Asset Listing
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetCreationForm;