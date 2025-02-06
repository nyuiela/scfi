import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AssetCardProps } from '@/lib/types/dashboard';


export function AssetCard({ title, country, value, address }: AssetCardProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-500">{country}</p>
            </div>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-2xl font-bold">${value}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="truncate">{address}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={copyAddress}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}