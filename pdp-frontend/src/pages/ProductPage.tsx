import React, { useRef, useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { ProductHero } from '../components/pdp/ProductHero';
import { VariantSelector } from '../components/pdp/VariantSelector';
import { BenefitBullets } from '../components/pdp/BenefitBullets';
import { RoutineQuiz } from '../components/pdp/RoutineQuiz';
import { IngredientsPanel } from '../components/pdp/IngredientsPanel';
import { AddToCartButton } from '../components/ui/AddToCartButton';
import { WishlistButton } from '../components/ui/WishlistButton';
import { StickyMobileBuyBar } from '../components/ui/StickyMobileBuyBar';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import {
  VARIANTS as STATIC_VARIANTS,
  BENEFITS as STATIC_BENEFITS,
  DISCLAIMER as STATIC_DISCLAIMER,
} from '../data/product';
import { useAddToCart } from '../hooks/useAddToCart';
import { useWishlistToggle } from '../hooks/useWishlist';
import { useProduct } from '../hooks/useProduct';
import type { Variant } from '../data/product';
import type { ApiProduct } from '../api/recommendation';

interface ProductPageProps {
  cartCount?: number;
  onAddToCart?: (variant: Variant) => void;
  onGoToCart?: () => void;
  onGoToWishlist?: () => void;
  onGoToMarketplace?: () => void;
}

export function ProductPage({
  cartCount = 0,
  onAddToCart,
  onGoToCart,
  onGoToWishlist,
  onGoToMarketplace,
}: ProductPageProps) {
  // Load product data from backend API; fall back to static data if API is down
  const { status: productStatus, product: apiProduct } = useProduct('ashwagandha');

  // Map API variant shape → local Variant type.
  // ApiVariant uses `priceCents`; Variant uses `price` — explicit mapping prevents null prices.
  const VARIANTS: Variant[] = apiProduct
    ? apiProduct.variants.map((v) => ({
        id: v.id,
        title: v.title,
        capsules: v.capsules,
        price: v.priceCents,          // priceCents → price (both INR paise)
        priceDisplay: v.priceDisplay,
        perDayDisplay: v.perDayDisplay,
        tag: v.tag ?? undefined,
        available: v.available,
      }))
    : STATIC_VARIANTS;
  const BENEFITS = apiProduct?.benefits ?? STATIC_BENEFITS;
  const DISCLAIMER = apiProduct?.disclaimer ?? STATIC_DISCLAIMER;

  const [selectedVariant, setSelectedVariant] = useState<Variant>(VARIANTS[1]);
  const [recommendedVariantId, setRecommendedVariantId] = useState<string | undefined>();

  // Keep selected variant in sync when API data loads
  React.useEffect(() => {
    if (apiProduct) {
      setSelectedVariant((VARIANTS[1] ?? VARIANTS[0]) as Variant);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiProduct]);

  const { status: cartStatus, addToCart } = useAddToCart();
  const buySectionRef = useRef<HTMLDivElement>(null);

  // Wishlist state for the currently selected variant
  const {
    isWishlisted,
    status: wishlistStatus,
    toggle: toggleWishlist,
  } = useWishlistToggle(selectedVariant, 'ashwagandha', 'Ashwagandha Capsules');

  function handleVariantChange(v: Variant) {
    setSelectedVariant(v);
  }

  function handleRecommendedVariant(v: Variant) {
    setSelectedVariant(v);
    setRecommendedVariantId(v.id);
    buySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleAddToCart() {
    // If a parent cart handler is provided (App.tsx), use it; otherwise fall back to simulation
    if (onAddToCart) {
      onAddToCart(selectedVariant);
    }
    addToCart(selectedVariant);
  }

  return (
    <div className="min-h-screen bg-ka-cream">

      {/* ── Site header ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-ka-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-serif font-bold text-ka-green-700">
              Kerala Ayurveda
            </span>
            <Badge variant="gold" className="hidden sm:inline-flex">
              Since 1945
            </Badge>
          </div>
          <nav
            className="flex items-center gap-3 text-sm text-ka-bark/70"
            aria-label="Site navigation"
          >
            <a href="#" className="hidden sm:inline hover:text-ka-green-700 transition-colors">Products</a>
            <a href="#" className="hidden sm:inline hover:text-ka-green-700 transition-colors">About</a>
            {onGoToMarketplace && (
              <button
                type="button"
                onClick={onGoToMarketplace}
                className="hidden sm:inline hover:text-ka-green-700 transition-colors"
              >
                Marketplace
              </button>
            )}
            {onGoToWishlist && (
              <button
                type="button"
                onClick={onGoToWishlist}
                aria-label="View wishlist"
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Heart size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Wishlist</span>
              </button>
            )}
            {onGoToCart && (
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
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-stone-400">
          <ol className="flex items-center gap-1.5">
            <li><a href="#" className="hover:text-ka-green-600 transition-colors">Home</a></li>
            <li aria-hidden="true">/</li>
            <li><a href="#" className="hover:text-ka-green-600 transition-colors">Supplements</a></li>
            <li aria-hidden="true">/</li>
            <li className="text-ka-bark/60" aria-current="page">Ashwagandha Capsules</li>
          </ol>
        </nav>

        {/* ── Main 2-column layout ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Left — gallery (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductHero selectedVariantTitle={selectedVariant.title} />
          </div>

          {/* Right — product info + purchase */}
          <div className="space-y-8">

            {/* Product identity */}
            <div className="animate-fade-up space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-ka-green-600">
                Kerala Ayurveda
              </p>
              <h1 className="font-serif text-3xl font-bold leading-tight text-ka-bark text-balance">
                {productStatus === 'loading' ? (
                  <Skeleton className="h-9 w-3/4" />
                ) : (
                  apiProduct?.title ?? 'Ashwagandha Capsules'
                )}
              </h1>
              {productStatus === 'loading' ? (
                <Skeleton lines={2} />
              ) : (
                <p className="text-sm leading-relaxed text-ka-bark/65">
                  {apiProduct?.subtitle ??
                    'Organic ashwagandha root extract, 600\u00a0mg per capsule. Formulated as a traditional adaptogen to support your body\'s natural response to stress, energy, and sleep.'}
                </p>
              )}
              {/* Show a subtle note when data is mocked (dev/demo only) */}
              {apiProduct?.dataSource === 'mocked' && (
                <p className="text-[10px] text-stone-400 italic">
                  Illustrative content — prices and variants are assumed for this demo.
                </p>
              )}
            </div>

            {/* Price display */}
            <div
              className="flex items-baseline gap-3 animate-fade-up"
              style={{ animationDelay: '60ms' }}
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="text-3xl font-bold text-ka-bark">
                {selectedVariant.priceDisplay}
              </span>
              <span className="text-sm text-stone-400">
                {selectedVariant.perDayDisplay}
              </span>
              {selectedVariant.tag && (
                <Badge variant="green">{selectedVariant.tag}</Badge>
              )}
            </div>

            {/* Variant selector */}
            <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
              <VariantSelector
                variants={VARIANTS}
                selected={selectedVariant}
                onChange={handleVariantChange}
                highlightId={recommendedVariantId}
              />
            </div>

            {/* Add to cart + Wishlist */}
            <div
              id="buy-section"
              ref={buySectionRef as React.RefObject<HTMLDivElement>}
              className="animate-fade-up flex flex-col gap-3"
              style={{ animationDelay: '100ms' }}
            >
              <AddToCartButton
                status={cartStatus}
                onClick={handleAddToCart}
                disabled={!selectedVariant.available}
              />
              <WishlistButton
                isWishlisted={isWishlisted}
                isLoading={wishlistStatus === 'loading'}
                onClick={toggleWishlist}
              />
              {!selectedVariant.available && (
                <p className="text-center text-xs text-red-500" role="alert">
                  This pack is currently unavailable.
                </p>
              )}
            </div>

            {/* Benefits */}
            <div
              className="animate-fade-up border-t border-stone-200 pt-6"
              style={{ animationDelay: '120ms' }}
            >
              <BenefitBullets benefits={BENEFITS} />
            </div>

            {/* Routine quiz — the decision-support feature */}
            <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
              <RoutineQuiz onVariantRecommend={handleRecommendedVariant} />
            </div>

            {/* Ingredients accordion */}
            <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
              <IngredientsPanel />
            </div>

            {/* Disclaimer */}
            <p
              className="text-[11px] leading-relaxed text-stone-400 animate-fade-in-slow"
              style={{ animationDelay: '200ms' }}
            >
              {DISCLAIMER}
            </p>

          </div>
        </div>
      </main>

      <footer className="mt-16 border-t border-stone-200 bg-white py-8 text-center text-xs text-stone-400">
        <p>© 2024 Kerala Ayurveda. This page is a prototype for evaluation purposes only.</p>
        <p className="mt-1 text-[11px]">
          Illustrative content is clearly labelled. Product images are placeholder stock photos.
        </p>
      </footer>

      {/* ── Sticky mobile buy bar ───────────────────────────────────────────── */}
      <StickyMobileBuyBar
        selectedVariant={selectedVariant}
        cartStatus={cartStatus}
        onAddToCart={handleAddToCart}
        buySectionRef={buySectionRef as React.RefObject<HTMLElement>}
      />
    </div>
  );
}

