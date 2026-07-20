import { useState, useEffect, useCallback } from 'react';
import { fetchMarketplace } from '../api/marketplace';
import type { MarketplaceProduct, ProductCategory } from '../types/marketplace';

type Status = 'loading' | 'success' | 'error';

interface UseMarketplaceReturn {
  status: Status;
  products: MarketplaceProduct[];
  total: number;
  error: string | null;
  activeCategory: ProductCategory | null;
  setCategory: (cat: ProductCategory | null) => void;
}

export function useMarketplace(): UseMarketplaceReturn {
  const [status, setStatus] = useState<Status>('loading');
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    fetchMarketplace(activeCategory ? { category: activeCategory } : undefined)
      .then((res) => {
        if (!cancelled) {
          setProducts(res.products);
          setTotal(res.total);
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
  }, [activeCategory]);

  const setCategory = useCallback((cat: ProductCategory | null) => {
    setActiveCategory(cat);
  }, []);

  return { status, products, total, error, activeCategory, setCategory };
}
