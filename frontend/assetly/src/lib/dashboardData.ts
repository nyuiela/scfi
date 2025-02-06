import { AiMetrics, Asset, Country } from "./types/dashboard";


export const countries: Country[] = [
  { code: 'GH', name: 'Ghana' },
  { code: 'FR', name: 'France' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
];

export const assets: Asset[] = [
  {
    id: '1',
    name: 'Gold',
    country: 'GH',
    value: 45000,
    address: '0x1234567890abcdef',
  },
  {
    id: '2',
    name: 'Cotton',
    country: 'FR',
    value: 32000,
    address: '0xabcdef1234567890',
  },
  {
    id: '3',
    name: 'Copper',
    country: 'ZM',
    value: 28000,
    address: '0x9876543210fedcba',
  },
  {
    id: '4',
    name: 'Oil',
    country: 'NG',
    value: 55000,
    address: '0xfedcba0987654321',
  },
];

export const aiMetrics: AiMetrics = {
  active: 12,
  completed: 145,
  successRate: 98,
};
