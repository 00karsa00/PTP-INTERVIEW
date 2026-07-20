import { useState, useEffect } from 'react';
import { fetchProduct, type ApiProduct } from '../api/recommendation';

type Status = 'loading' | 'success' | 'error';

interface UseProductReturn {
  status: Status;
  product: ApiProduct | null;
  error: string | null;
}

/**
 * Loads product data from the backend API on mount.
 * Falls back gracefully: if the API is unreachable the page still works
 * using the static data exported from `data/product.ts` (passed as fallback).
 */
export function useProduct(handle: string): UseProductReturn {
  const [status, setStatus]   = useState<Status>('loading');
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    fetchProduct(handle)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
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
  }, [handle]);

  return { status, product, error };
}
