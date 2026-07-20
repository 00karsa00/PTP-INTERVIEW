import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Package } from 'lucide-react';
import { clsx } from 'clsx';
import { Skeleton } from '../components/ui/Skeleton';
import { Badge } from '../components/ui/Badge';
import { useWishlistList } from '../hooks/useWishlist';
import type { WishlistItem } from '../types/wishlist';

interface WishlistPageProps {
  onBack: () => void;
  onGoToCart: () => void;
  onAddItemToCart: (item: WishlistItem) => void;
}

export function WishlistPage({ onBack, onGoToCart, onAddItemToCart }: WishlistPageProps) {
  const { status, items, count, error, removeItem } = useWishlistList();

  return (
    <div className="min-h-screen bg-ka-cream">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-ka-cream/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
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
            <span className="text-lg font-serif font-bold text-ka-green-700">
              Kerala Ayurveda
            </span>
          </div>
          <button
            type="button"
            onClick={onGoToCart}
            className="flex items-center gap-1.5 text-sm text-ka-bark/70 hover:text-ka-green-700 transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">

        {/* Page title */}
        <div className="mb-8 flex items-center gap-3">
          <Heart size={24} className="text-red-500 fill-red-500" aria-hidden="true" />
          <div>
            <h1 className="font-serif text-2xl font-bold text-ka-bark">
              Your Wishlist
            </h1>
            {status === 'success' && (
              <p className="mt-0.5 text-sm text-stone-400">
                {count === 0
                  ? 'No saved items yet'
                  : `${count} saved item${count !== 1 ? 's' : ''}`}
              </p>
            )}
          </div>
        </div>

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {status === 'loading' && (
          <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading wishlist">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4"
              >
                <Skeleton className="h-16 w-16 flex-shrink-0 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
          >
            <p className="font-semibold text-red-700">Couldn't load your wishlist</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {status === 'success' && count === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white py-16 text-center">
            <Heart size={48} className="text-stone-200" aria-hidden="true" />
            <div>
              <p className="font-semibold text-ka-bark">Nothing saved yet</p>
              <p className="mt-1 text-sm text-stone-400">
                Tap the heart icon on a product to save it here.
              </p>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="mt-2 rounded-xl bg-ka-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-ka-green-700 transition-colors"
            >
              Browse products
            </button>
          </div>
        )}

        {/* ── Item list ────────────────────────────────────────────────────── */}
        {status === 'success' && count > 0 && (
          <ul className="space-y-4" aria-label="Wishlist items">
            {items.map((item) => (
              <WishlistCard
                key={`${item.productHandle}-${item.variantId}`}
                item={item}
                onRemove={() => removeItem(item.variantId, item.productHandle)}
                onAddToCart={() => onAddItemToCart(item)}
              />
            ))}
          </ul>
        )}

        {/* Data source note */}
        <p className="mt-8 text-center text-[11px] text-stone-400 italic">
          Wishlist is stored server-side (in-memory — not persisted across restarts). Session ID is anonymous and stored in localStorage.
        </p>

      </main>
    </div>
  );
}

// ── WishlistCard sub-component ─────────────────────────────────────────────────

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: () => void;
  onAddToCart: () => void;
}

function WishlistCard({ item, onRemove, onAddToCart }: WishlistCardProps) {
  const [removing, setRemoving] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);

  async function handleRemove() {
    setRemoving(true);
    await onRemove();
    // No need to unset — the item will be removed from the list
  }

  function handleAddToCart() {
    if (!item.available) return;
    onAddToCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }

  return (
    <li
      className={clsx(
        'flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center',
        'transition-opacity duration-300',
        removing && 'opacity-40 pointer-events-none',
      )}
    >
      {/* Product icon / placeholder */}
      <div
        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-ka-green-50 text-ka-green-500"
        aria-hidden="true"
      >
        <Package size={28} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-ka-bark truncate">{item.productTitle}</p>
          {item.tag && <Badge variant="green">{item.tag}</Badge>}
        </div>
        <p className="mt-0.5 text-sm text-stone-400">
          {item.variantTitle} · {item.capsules} capsules
        </p>
        <p className="mt-1 text-base font-semibold text-ka-bark">
          {item.priceDisplay}
        </p>
        {!item.available && (
          <p className="mt-0.5 text-xs text-red-500 font-medium">Out of stock</p>
        )}
        <p className="mt-0.5 text-[11px] text-stone-300">
          Saved {new Date(item.addedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!item.available || addedToCart}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white',
            'transition-all duration-150',
            item.available && !addedToCart
              ? 'bg-ka-green-600 hover:bg-ka-green-700'
              : !item.available
                ? 'cursor-not-allowed bg-stone-200 text-stone-400'
                : 'bg-ka-green-700 cursor-default',
          )}
        >
          {addedToCart ? (
            <>✓ Added</>
          ) : (
            <>
              <ShoppingBag size={14} aria-hidden="true" />
              {item.available ? 'Add to cart' : 'Unavailable'}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleRemove}
          disabled={removing}
          aria-label={`Remove ${item.productTitle} — ${item.variantTitle} from wishlist`}
          className="flex items-center justify-center rounded-xl border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
