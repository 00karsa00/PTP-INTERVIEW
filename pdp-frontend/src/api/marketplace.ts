import axios, { AxiosError } from 'axios';
import type { MarketplaceListResponse, MarketplaceProduct, ProductCategory } from '../types/marketplace';
import type { ApiWrapper } from '../types/recommendation';

const client = axios.create({
  baseURL: '/api/v1',
  timeout: 12_000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message: string | string[] }>) => {
    const msg = err.response?.data?.message;
    const readable = Array.isArray(msg) ? msg.join('; ') : msg || err.message;
    if (err.code === 'ECONNABORTED') return Promise.reject(new Error('Request timed out.'));
    if (!err.response) return Promise.reject(new Error('Cannot reach the server.'));
    return Promise.reject(new Error(readable));
  },
);

export async function fetchMarketplace(filters?: {
  category?: ProductCategory;
  featured?: boolean;
}): Promise<MarketplaceListResponse> {
  const params: Record<string, string> = {};
  if (filters?.category) params.category = filters.category;
  if (filters?.featured) params.featured = 'true';

  const res = await client.get<ApiWrapper<MarketplaceListResponse>>('/marketplace', { params });
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data;
}

export async function fetchMarketplaceProduct(handle: string): Promise<MarketplaceProduct> {
  const res = await client.get<ApiWrapper<MarketplaceProduct>>(`/marketplace/${handle}`);
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data;
}
