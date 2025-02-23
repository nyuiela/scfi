/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Brain, Coins, Building2, PiggyBank, BarChart3, Warehouse, ShieldCheck, FileSpreadsheet, LucideIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';

// Define types for our settings and config items
interface Settings {
  assetTokenization: boolean;
  tradingExecution: boolean;
  poolManagement: boolean;
  valuationAnalysis: boolean;
  assetManagement: boolean;
  lendingServices: boolean;
  complianceChecks: boolean;
}

interface ConfigItem {
  id: keyof Settings;
  label: string;
  description: string;
  icon: LucideIcon;
}

const AIActionsConfig = () => {
  const [settings, setSettings] = React.useState<Settings>({
    assetTokenization: true,
    tradingExecution: true,
    poolManagement: false,
    valuationAnalysis: true,
    assetManagement: true,
    lendingServices: false,
    complianceChecks: false
  });

  const [isSaving, setIsSaving] = React.useState(false);

  const handleToggle = (setting: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved', {
        description: 'Your AI action configurations have been updated successfully.',
      });
    } catch (_error) {
      toast.error('Error', {
        description: 'Failed to save settings. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const configItems: ConfigItem[] = [
    {
      id: 'assetTokenization',
      label: 'Asset Tokenization',
      description: 'Enable AI to assist in creating and managing tokenized real-world assets',
      icon: Building2
    },
    {
      id: 'tradingExecution',
      label: 'Trading & Exchange',
      description: 'Facilitate automated trading and exchange of tokenized assets',
      icon: Coins
    },
    {
      id: 'poolManagement',
      label: 'Lending Pool Management',
      description: 'Manage lending pools, interest rates, and liquidity provisions',
      icon: PiggyBank
    },
    {
      id: 'valuationAnalysis',
      label: 'Valuation Analysis',
      description: 'AI-powered analysis of asset values and market trends',
      icon: BarChart3
    },
    {
      id: 'assetManagement',
      label: 'Asset Management',
      description: 'Monitor and manage real-world asset portfolio performance',
      icon: Warehouse
    },
    {
      id: 'lendingServices',
      label: 'Lending Services',
      description: 'Enable borrowing and lending against tokenized assets',
      icon: FileSpreadsheet
    },
    {
      id: 'complianceChecks',
      label: 'Compliance & Security',
      description: 'Automated compliance checks and security monitoring',
      icon: ShieldCheck
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <Card className="max-w-4xl mx-auto mb-10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8" />
            <div>
              <CardTitle className="text-2xl">AI Actions Management</CardTitle>
              <CardDescription>Configure which AI capabilities are enabled for your real-world asset platform</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {configItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor={item.id} className="text-base font-medium">
                      {item.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={item.id}
                  checked={settings[item.id]}
                  onCheckedChange={() => handleToggle(item.id)}
                />
              </div>
            ))}

            <div className="flex justify-end pt-6">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-32"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIActionsConfig;