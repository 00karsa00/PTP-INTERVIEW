import axios, { AxiosError } from 'axios';
import type {
  RecommendRequest,
  RecommendResponse,
  ApiWrapper,
} from '../types/recommendation';

const client = axios.create({
  baseURL: '/api/v1',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor — unwrap NestJS error shape into a plain Error ───────
client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message: string | string[]; statusCode: number }>) => {
    const serverMsg = err.response?.data?.message;
    // NestJS ValidationPipe returns message as string[] for 400s
    const readable = Array.isArray(serverMsg)
      ? serverMsg.join('; ')
      : serverMsg || err.message;

    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!err.response) {
      return Promise.reject(
        new Error('Cannot reach the server. Check your connection.'),
      );
    }
    return Promise.reject(new Error(readable));
  },
);

// ── Recommendation ─────────────────────────────────────────────────────────────

export async function fetchRecommendation(
  req: RecommendRequest,
): Promise<RecommendResponse> {
  const res = await client.post<ApiWrapper<RecommendResponse>>(
    '/recommendation',
    req,
  );
  if (!res.data.success) {
    throw new Error('API returned success=false');
  }
  return res.data.data;
}

// ── Product data ───────────────────────────────────────────────────────────────

export interface ApiVariant {
  id: string;
  title: string;
  capsules: number;
  priceCents: number;
  priceDisplay: string;
  perDayDisplay: string;
  tag: string | null;
  available: boolean;
}

export interface ApiBenefit {
  icon: string;
  heading: string;
  body: string;
}

export interface ApiIngredient {
  name: string;
  amount: string;
  role: string;
}

export interface ApiProduct {
  handle: string;
  title: string;
  subtitle: string;
  variants: ApiVariant[];
  benefits: ApiBenefit[];
  ingredients: ApiIngredient[];
  trustSignals: string[];
  disclaimer: string;
  dataSource: 'mocked' | 'live';
}

export async function fetchProduct(handle: string): Promise<ApiProduct> {
  const res = await client.get<ApiWrapper<ApiProduct>>(`/products/${handle}`);
  if (!res.data.success) {
    throw new Error('API returned success=false');
  }
  return res.data.data;
}
