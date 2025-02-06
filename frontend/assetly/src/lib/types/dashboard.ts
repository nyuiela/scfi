// types/dashboard.ts
export interface Asset {
    id: string;
    name: string;
    country: string;
    value: number;
    address: string;
  }
  
  export interface Country {
    code: string;
    name: string;
  }
  
  export interface AiMetrics {
    active: number;
    completed: number;
    successRate: number;
  }
  
  export interface AssetCardProps {
    title: string;
    country: string;
    value: string;
    address: string;
  }