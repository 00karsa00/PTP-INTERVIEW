import { useState, useCallback, useEffect } from 'react';
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlisted,
  fetchWishlist,
} from '../api/wishlist';
import type { WishlistItem } from '../types/wishlist';
import type { Variant } from '../data/product';

type ToggleStatus = 'idle' | 'loading' | 'error';

interface UseWishlistToggleReturn {
  isWishlisted: boolean;
  status: ToggleStatus;
  toggle: () => Promise<void>;
  error: string | null;
}

/**
 * Hook for the PDP — manages the wishlist state of a single variant.
 * Checks backend on mount to sync state with the server-side wishlist.
 */
export function useWishlistToggle(
  variant: Variant,
  productHandle: string,
  productTitle: string,
): UseWishlistToggleReturn {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [status, setStatus] = useState<ToggleStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Sync wishlist state from the backend on mount / variant change
  useEffect(() => {
    let cancelled = false;
    checkWishlisted(variant.id, productHandle)
      .then((w) => { if (!cancelled) setIsWishlisted(w); })
      .catch(() => { /* Fail silently — heart defaults to un-wishlisted */ });
    return () => { cancelled = true; };
  }, [variant.id, productHandle]);

  const toggle = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      if (isWishlisted) {
        await removeFromWishlist(variant.id, productHandle);
        setIsWishlisted(false);
      } else {
        await addToWishlist(variant, productHandle, productTitle);
        setIsWishlisted(true);
      }
      setStatus('idle');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not update wishlist.';
      setError(msg);
      setStatus('error');
    }
  }, [isWishlisted, variant, productHandle, productTitle]);

  return { isWishlisted, status, toggle, error };
}

// ── Hook for the Wishlist page ─────────────────────────────────────────────────

type ListStatus = 'loading' | 'success' | 'error';

interface UseWishlistListReturn {
  status: ListStatus;
  items: WishlistItem[];
  count: number;
  error: string | null;
  removeItem: (variantId: string, productHandle: string) => Promise<void>;
  refresh: () => void;
}

/**
 * Hook for the Wishlist page — fetches the full wishlist and exposes remove.
 */
export function useWishlistList(): UseWishlistListReturn {
  const [status, setStatus] = useState<ListStatus>('loading');
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchWishlist()
      .then((result) => {
        if (!cancelled) {
          setItems(result.items);
          setCount(result.count);
          setStatus('success');
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setStatus('error');
        }
      });
    return () => { cancelled = true; };
  }, [revision]);

  const removeItem = useCallback(async (variantId: string, productHandle: string) => {
    try {
      const result = await removeFromWishlist(variantId, productHandle);
      setItems(result.items);
      setCount(result.count);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not remove item.';
      setError(msg);
    }
  }, []);

  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  return { status, items, count, error, removeItem, refresh };
}
