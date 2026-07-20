import { useState, useCallback } from 'react';
import type { Variant } from '../data/product';

type CartStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseAddToCartReturn {
  status: CartStatus;
  addToCart: (variant: Variant) => Promise<void>;
  reset: () => void;
}

/**
 * Simulated add-to-cart.
 * In a real Shopify theme this would call /cart/add.js.
 * The 1.2s delay is intentional — it exercises the loading micro-interaction.
 */
export function useAddToCart(): UseAddToCartReturn {
  const [status, setStatus] = useState<CartStatus>('idle');

  const addToCart = useCallback(async (variant: Variant) => {
    if (!variant.available) return;

    setStatus('loading');

    // Simulate network latency — replace with fetch('/cart/add.js', ...) in Shopify
    await new Promise<void>((resolve) => setTimeout(resolve, 1200));

    // 95% success rate simulation — in prod you'd handle real errors
    if (Math.random() > 0.05) {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2500);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }, []);

  const reset = useCallback(() => setStatus('idle'), []);

  return { status, addToCart, reset };
}
