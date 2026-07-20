import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';
import type { MarketplaceProduct } from '../../types/marketplace';

interface ProductCardProps {
  product: MarketplaceProduct;
  onAddToCart: (product: MarketplaceProduct) => void;
  onToggleWishlist: (product: MarketplaceProduct) => void;
  isWishlisted: boolean;
  /** Stagger index for entrance animation */
  index?: number;
}

/** Star rating row — renders filled / half / empty stars */
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating: ${rating} out of 5 (${count} reviews)`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={11}
            className={clsx(
              'flex-shrink-0',
              star <= Math.round(rating)
                ? 'fill-ka-gold-400 text-ka-gold-400'
                : 'fill-none text-stone-300',
            )}
          />
        ))}
      </div>
      <span className="text-[11px] text-stone-400">
        {rating.toFixed(1)} <span className="text-stone-300">({count})</span>
      </span>
    </div>
  );
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  index = 0,
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    onAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  }

  async function handleWishlist(e: React.MouseEvent) {
    e.stopPropagation();
    setWishlistLoading(true);
    await onToggleWishlist(product);
    setWishlistLoading(false);
  }

  const delayStyle = { animationDelay: `${index * 60}ms` } as React.CSSProperties;

  return (
    <article
      className="group flex flex-col rounded-2xl border border-stone-200 bg-white overflow-hidden
                 hover:border-ka-green-200 hover:shadow-md transition-all duration-200 animate-fade-up"
      style={delayStyle}
      aria-label={product.title}
    >
      {/* ── Image ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-stone-100" style={{ aspectRatio: '4/3' }}>
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Fallback gradient when image fails to load */
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ka-green-50 to-stone-100">
            <span className="text-4xl" aria-hidden="true">🌿</span>
          </div>
        )}

        {/* Category badge — top left */}
        <div className="absolute left-3 top-3">
          <Badge variant="green">{product.categoryLabel}</Badge>
        </div>

        {/* Featured ribbon — top right */}
        {product.featured && (
          <div className="absolute right-3 top-3">
            <Badge variant="gold">Featured</Badge>
          </div>
        )}

        {/* Wishlist heart — hover reveal on desktop, always visible on touch */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={wishlistLoading}
          aria-label={isWishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={isWishlisted}
          className={clsx(
            'absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm',
            'border transition-all duration-200',
            'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
            isWishlisted
              ? 'border-red-200 bg-white text-red-500'
              : 'border-stone-200 bg-white/90 text-stone-400 hover:text-red-400',
            wishlistLoading && 'cursor-wait',
          )}
        >
          <Heart
            size={16}
            aria-hidden="true"
            className={clsx(
              'transition-all duration-150',
              isWishlisted ? 'fill-red-500' : 'fill-none',
              wishlistLoading && 'animate-pulse',
            )}
          />
        </button>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title + subtitle */}
        <div>
          <h3 className="text-sm font-semibold leading-snug text-ka-bark line-clamp-2">
            {product.title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-stone-400 line-clamp-2">
            {product.subtitle}
          </p>
        </div>

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Tags */}
        <div className="flex flex-wrap gap-1" aria-label="Product tags">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div>
            <p className="text-lg font-bold text-ka-bark">
              {product.defaultVariant.priceDisplay}
            </p>
            <p className="text-[10px] text-stone-400">
              {product.defaultVariant.title}
            </p>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.defaultVariant.available || addedToCart}
            aria-label={addedToCart ? 'Added to cart' : `Add ${product.title} to cart`}
            className={clsx(
              'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white',
              'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-1',
              addedToCart
                ? 'bg-ka-green-700 cursor-default'
                : product.defaultVariant.available
                  ? 'bg-ka-green-600 hover:bg-ka-green-700 active:scale-95'
                  : 'cursor-not-allowed bg-stone-200 text-stone-400',
            )}
          >
            {addedToCart ? (
              <>
                <CheckCircle size={13} aria-hidden="true" />
                Added
              </>
            ) : (
              <>
                <ShoppingBag size={13} aria-hidden="true" />
                {product.defaultVariant.available ? 'Add' : 'N/A'}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
