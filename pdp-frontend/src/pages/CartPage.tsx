import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Heart,
  Package,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Badge } from '../components/ui/Badge';
import type { CartItem } from '../hooks/useCart';

interface CartPageProps {
  items: CartItem[];
  count: number;
  totalDisplay: string;
  totalCents: number;
  onBack: () => void;
  onGoToWishlist: () => void;
  onRemoveItem: (variantId: string, productHandle: string) => void;
  onUpdateQuantity: (variantId: string, productHandle: string, quantity: number) => void;
  onClearCart: () => void;
}

/** Formats INR paise to ₹ display string */
function fmt(paise: number): string {
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function CartPage({
  items,
  count,
  totalDisplay,
  totalCents,
  onBack,
  onGoToWishlist,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartPageProps) {
  const [checkoutDone, setCheckoutDone] = useState(false);

  function handleCheckout() {
    // SIMULATED — in a real Shopify theme this redirects to /checkout
    setCheckoutDone(true);
    setTimeout(() => {
      setCheckoutDone(false);
      onClearCart();
    }, 3000);
  }

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
            onClick={onGoToWishlist}
            className="flex items-center gap-1.5 text-sm text-ka-bark/70 hover:text-red-500 transition-colors"
            aria-label="View wishlist"
          >
            <Heart size={18} aria-hidden="true" />
            <span className="hidden sm:inline">Wishlist</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">

        {/* Page title */}
        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag size={24} className="text-ka-green-600" aria-hidden="true" />
          <div>
            <h1 className="font-serif text-2xl font-bold text-ka-bark">Your Cart</h1>
            <p className="mt-0.5 text-sm text-stone-400">
              {count === 0
                ? 'Your cart is empty'
                : `${count} item${count !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* ── Checkout success overlay ──────────────────────────────────────── */}
        {checkoutDone && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 flex items-center gap-3 rounded-2xl border border-ka-green-200 bg-ka-green-50 p-5"
          >
            <CheckCircle size={24} className="flex-shrink-0 text-ka-green-500" aria-hidden="true" />
            <div>
              <p className="font-semibold text-ka-green-700">Order placed! (simulated)</p>
              <p className="mt-0.5 text-sm text-ka-green-600">
                In a real Shopify store, you'd be redirected to the secure checkout. Cart will clear in a moment.
              </p>
            </div>
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────────────────── */}
        {count === 0 && !checkoutDone && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white py-16 text-center">
            <ShoppingBag size={48} className="text-stone-200" aria-hidden="true" />
            <div>
              <p className="font-semibold text-ka-bark">Nothing in your cart</p>
              <p className="mt-1 text-sm text-stone-400">
                Add items from the product page to get started.
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

        {/* ── Cart layout: items + summary ──────────────────────────────────── */}
        {count > 0 && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Item list */}
            <div className="lg:col-span-2">
              <ul className="space-y-4" aria-label="Cart items">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.productHandle}-${item.variantId}`}
                    item={item}
                    onRemove={() => onRemoveItem(item.variantId, item.productHandle)}
                    onQuantityChange={(q) =>
                      onUpdateQuantity(item.variantId, item.productHandle, q)
                    }
                  />
                ))}
              </ul>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-stone-200 bg-white p-5">
                <h2 className="mb-4 font-serif text-lg font-semibold text-ka-bark">
                  Order summary
                </h2>

                <div className="space-y-2 text-sm text-ka-bark/70">
                  {items.map((item) => (
                    <div key={`${item.productHandle}-${item.variantId}`} className="flex justify-between gap-2">
                      <span className="truncate">
                        {item.productTitle} — {item.variantTitle}
                        {item.quantity > 1 && (
                          <span className="text-stone-400"> × {item.quantity}</span>
                        )}
                      </span>
                      <span className="flex-shrink-0 font-medium text-ka-bark">
                        {fmt(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-4 border-t border-stone-100" />

                <div className="flex justify-between text-base font-semibold text-ka-bark">
                  <span>Total</span>
                  <span>{totalDisplay}</span>
                </div>

                <p className="mt-1 text-[11px] text-stone-400">
                  GST and shipping calculated at checkout
                </p>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutDone}
                  className={clsx(
                    'mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5',
                    'text-sm font-semibold text-white transition-all duration-200',
                    checkoutDone
                      ? 'cursor-default bg-ka-green-700'
                      : 'bg-ka-green-600 hover:bg-ka-green-700 active:scale-[0.98]',
                  )}
                >
                  <Lock size={14} aria-hidden="true" />
                  {checkoutDone ? 'Processing…' : 'Proceed to checkout'}
                </button>

                {/* Simulated checkout note */}
                <p className="mt-2 text-center text-[10px] text-stone-400 italic">
                  Checkout is simulated — no real order will be placed.
                </p>

                <button
                  type="button"
                  onClick={onGoToWishlist}
                  className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-4 py-2.5 text-sm text-stone-500 hover:border-red-200 hover:text-red-500 transition-all"
                >
                  <Heart size={14} aria-hidden="true" />
                  View wishlist
                </button>
              </div>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// ── CartItemRow sub-component ──────────────────────────────────────────────────

interface CartItemRowProps {
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

function CartItemRow({ item, onRemove, onQuantityChange }: CartItemRowProps) {
  return (
    <li className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center">
      {/* Icon */}
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
          {fmt(item.priceCents * item.quantity)}
          {item.quantity > 1 && (
            <span className="ml-1 text-xs font-normal text-stone-400">
              ({item.priceDisplay} each)
            </span>
          )}
        </p>
      </div>

      {/* Quantity + remove */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1">
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity - 1)}
            aria-label="Decrease quantity"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:text-ka-bark transition-all"
          >
            <Minus size={13} aria-hidden="true" />
          </button>
          <span
            className="min-w-[1.5rem] text-center text-sm font-semibold text-ka-bark"
            aria-label={`Quantity: ${item.quantity}`}
          >
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            aria-label="Increase quantity"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-500 hover:bg-white hover:text-ka-bark transition-all"
          >
            <Plus size={13} aria-hidden="true" />
          </button>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${item.productTitle} — ${item.variantTitle} from cart`}
          className="flex items-center justify-center rounded-xl border border-stone-200 p-2.5 text-stone-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
