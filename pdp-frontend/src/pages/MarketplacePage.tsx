import React, { useState, useCallback } from 'react';
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ProductCard } from '../components/marketplace/ProductCard';
import { useMarketplace } from '../hooks/useMarketplace';
import {
  addToWishlist,
  removeFromWishlist,
  checkWishlisted,
} from '../api/wishlist';
import type { MarketplaceProduct, ProductCategory } from '../types/marketplace';
import type { Variant } from '../data/product';

interface MarketplacePageProps {
  cartCount: number;
  onAddToCart: (variant: Variant, productHandle: string, productTitle: string) => void;
  onGoToCart: () => void;
  onGoToWishlist: () => void;
  onBack: () => void;
}

// ── Category filter tabs ───────────────────────────────────────────────────────

const CATEGORY_TABS: Array<{ value: ProductCategory | null; label: string }> = [
  { value: null,           label: 'All' },
  { value: 'adaptogen',    label: 'Adaptogen' },
  { value: 'immunity',     label: 'Immunity' },
  { value: 'digestion',    label: 'Digestion' },
  { value: 'skincare',     label: 'Skincare' },
  { value: 'hair',         label: 'Hair Care' },
  { value: 'sleep',        label: 'Sleep' },
  { value: 'joint',        label: 'Joint Care' },
  { value: 'womens_health', label: "Women's Health" },
];

// ── Helper: MarketplaceVariant → Variant (for cart) ──────────────────────────

function toCartVariant(product: MarketplaceProduct): Variant {
  const mv = product.defaultVariant;
  return {
    id: mv.id,
    title: mv.title,
    capsules: 0,          // not stored on marketplace variant; cart doesn't need it
    price: mv.priceCents,
    priceDisplay: mv.priceDisplay,
    perDayDisplay: '',
    tag: product.featured ? 'Featured' : undefined,
    available: mv.available,
  };
}

export function MarketplacePage({
  cartCount,
  onAddToCart,
  onGoToCart,
  onGoToWishlist,
  onBack,
}: MarketplacePageProps) {
  const { status, products, total, error, activeCategory, setCategory } =
    useMarketplace();

  // Local wishlist set: track which product handles are wishlisted
  const [wishlistedHandles, setWishlistedHandles] = useState<Set<string>>(
    () => new Set(),
  );

  // On first render, sync wishlist state from backend for all loaded products
  React.useEffect(() => {
    if (status !== 'success') return;
    products.forEach((p) => {
      checkWishlisted(p.defaultVariant.id, p.handle)
        .then((isW) => {
          if (isW) {
            setWishlistedHandles((prev) => new Set([...prev, p.handle]));
          }
        })
        .catch(() => { /* Fail silently */ });
    });
  // Only run when products array stabilises after load
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleAddToCart = useCallback(
    (product: MarketplaceProduct) => {
      onAddToCart(toCartVariant(product), product.handle, product.title);
    },
    [onAddToCart],
  );

  const handleToggleWishlist = useCallback(
    async (product: MarketplaceProduct) => {
      const isW = wishlistedHandles.has(product.handle);
      try {
        if (isW) {
          await removeFromWishlist(product.defaultVariant.id, product.handle);
          setWishlistedHandles((prev) => {
            const next = new Set(prev);
            next.delete(product.handle);
            return next;
          });
        } else {
          await addToWishlist(
            toCartVariant(product),
            product.handle,
            product.title,
          );
          setWishlistedHandles((prev) => new Set([...prev, product.handle]));
        }
      } catch {
        /* Silently fail — heart state stays as-is */
      }
    },
    [wishlistedHandles],
  );

  return (
    <div className="min-h-screen bg-ka-cream">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-ka-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-ka-bark/60 hover:text-ka-green-700 transition-colors"
              aria-label="Back to product"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif font-bold text-ka-green-700">
                Kerala Ayurveda
              </span>
              <Badge variant="gold" className="hidden sm:inline-flex">Since 1945</Badge>
            </div>
          </div>

          <nav className="flex items-center gap-3 text-sm text-ka-bark/70" aria-label="Site navigation">
            <button
              type="button"
              onClick={onGoToWishlist}
              aria-label="View wishlist"
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Heart size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Wishlist</span>
            </button>
            <button
              type="button"
              onClick={onGoToCart}
              aria-label={`View cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              className="relative flex items-center gap-1 hover:text-ka-green-700 transition-colors"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ka-green-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

        {/* ── Page hero ───────────────────────────────────────────────────── */}
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-ka-green-600">
            Kerala Ayurveda
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ka-bark">
            Herbal Marketplace
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ka-bark/60">
            Rooted in 75 years of Ayurvedic tradition. All 10 products below are dummy
            catalogue items for this demo — clearly labelled as mocked data.
          </p>
        </div>

        {/* ── Category filter bar ──────────────────────────────────────────── */}
        <div
          className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 animate-fade-up"
          style={{ animationDelay: '40ms' }}
          role="group"
          aria-label="Filter by category"
        >
          <SlidersHorizontal size={15} className="flex-shrink-0 text-stone-400" aria-hidden="true" />
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setCategory(tab.value)}
              aria-pressed={activeCategory === tab.value}
              className={clsx(
                'flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-400 focus-visible:ring-offset-1',
                activeCategory === tab.value
                  ? 'bg-ka-green-600 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-500 hover:border-ka-green-300 hover:text-ka-green-700',
              )}
            >
              {tab.label}
            </button>
          ))}

          {/* Clear filter */}
          {activeCategory && (
            <button
              type="button"
              onClick={() => setCategory(null)}
              aria-label="Clear category filter"
              className="flex-shrink-0 flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-100 transition-all"
            >
              <X size={11} aria-hidden="true" />
              Clear
            </button>
          )}
        </div>

        {/* Result count */}
        {status === 'success' && (
          <p
            className="mb-5 text-xs text-stone-400"
            aria-live="polite"
            aria-atomic="true"
          >
            {total} product{total !== 1 ? 's' : ''}
            {activeCategory
              ? ` in "${CATEGORY_TABS.find((t) => t.value === activeCategory)?.label}"`
              : ''}
          </p>
        )}

        {/* ── Loading skeleton grid ────────────────────────────────────────── */}
        {status === 'loading' && (
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            role="status"
            aria-live="polite"
            aria-label="Loading products"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden">
                <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <p className="font-semibold text-red-700">Couldn't load the marketplace</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
            <p className="mt-2 text-xs text-red-400">
              Make sure the backend is running on port 3001.
            </p>
          </div>
        )}

        {/* ── Empty (filtered) ────────────────────────────────────────────── */}
        {status === 'success' && total === 0 && (
          <div className="rounded-2xl border border-stone-200 bg-white py-16 text-center">
            <p className="font-semibold text-ka-bark">No products in this category</p>
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="mt-4 rounded-xl bg-ka-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-ka-green-700 transition-colors"
            >
              Show all
            </button>
          </div>
        )}

        {/* ── Product grid ────────────────────────────────────────────────── */}
        {status === 'success' && total > 0 && (
          <ul
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            aria-label="Product listing"
          >
            {products.map((product, i) => (
              <li key={product.handle}>
                <ProductCard
                  product={product}
                  index={i}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistedHandles.has(product.handle)}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Data source note */}
        <p className="mt-10 text-center text-[11px] text-stone-400 italic">
          All products are dummy/mocked data for this demo. Images are Unsplash
          placeholders. Prices are illustrative INR figures.
        </p>

      </main>
    </div>
  );
}
