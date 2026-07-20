import axios, { AxiosError } from 'axios';
import type {
  WishlistResult,
  WishlistMutationResult,
  WishlistCheckResult,
} from '../types/wishlist';
import type { ApiWrapper } from '../types/recommendation';
import type { Variant } from '../data/product';

const client = axios.create({
  baseURL: '/api/v1',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Unwrap NestJS error shapes into plain Error objects
client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message: string | string[]; statusCode: number }>) => {
    const serverMsg = err.response?.data?.message;
    const readable = Array.isArray(serverMsg)
      ? serverMsg.join('; ')
      : serverMsg || err.message;

    if (err.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    if (!err.response) {
      return Promise.reject(new Error('Cannot reach the server. Check your connection.'));
    }
    return Promise.reject(new Error(readable));
  },
);

// ── Session ID helpers ──────────────────────────────────────────────────────────
// An anonymous session ID is generated once per browser and stored in localStorage.
// It acts as a user identity for the wishlist — no auth required.
// In production this would be replaced by a verified auth token.

const SESSION_KEY = 'ka_wishlist_session';

export function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      // crypto.randomUUID() is widely supported in modern browsers
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // localStorage may be unavailable in certain environments
    return `sess-${Date.now()}`;
  }
}

// ── API functions ──────────────────────────────────────────────────────────────

export async function fetchWishlist(): Promise<WishlistResult> {
  const sessionId = getSessionId();
  const res = await client.get<ApiWrapper<WishlistResult>>('/wishlist', {
    params: { sessionId },
  });
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data;
}

export async function checkWishlisted(
  variantId: string,
  productHandle: string,
): Promise<boolean> {
  const sessionId = getSessionId();
  const res = await client.get<ApiWrapper<WishlistCheckResult>>('/wishlist/check', {
    params: { sessionId, variantId, productHandle },
  });
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data.wishlisted;
}

export async function addToWishlist(
  variant: Variant,
  productHandle: string,
  productTitle: string,
): Promise<WishlistMutationResult> {
  const sessionId = getSessionId();
  const res = await client.post<ApiWrapper<WishlistMutationResult>>('/wishlist', {
    sessionId,
    variantId: variant.id,
    variantTitle: variant.title,
    productHandle,
    productTitle,
    priceCents: variant.price,
    priceDisplay: variant.priceDisplay,
    capsules: variant.capsules,
    available: variant.available,
    tag: variant.tag ?? undefined,
  });
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data;
}

export async function removeFromWishlist(
  variantId: string,
  productHandle: string,
): Promise<WishlistMutationResult> {
  const sessionId = getSessionId();
  const res = await client.delete<ApiWrapper<WishlistMutationResult>>('/wishlist', {
    data: { sessionId, variantId, productHandle },
  });
  if (!res.data.success) throw new Error('API returned success=false');
  return res.data.data;
}
