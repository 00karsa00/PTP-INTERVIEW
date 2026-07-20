import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { ShoppingBag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { Variant } from '../../data/product';

type CartStatus = 'idle' | 'loading' | 'success' | 'error';

interface StickyMobileBuyBarProps {
  selectedVariant: Variant;
  cartStatus: CartStatus;
  onAddToCart: () => void;
  /** ref to the in-page buy section — bar hides when that element is visible */
  buySectionRef: React.RefObject<HTMLElement>;
}

const ICON_MAP = {
  idle:    { Icon: ShoppingBag, label: 'Add to Cart' },
  loading: { Icon: Loader2,     label: 'Adding…' },
  success: { Icon: CheckCircle, label: 'Added!' },
  error:   { Icon: AlertCircle, label: 'Try again' },
} as const;

export function StickyMobileBuyBar({
  selectedVariant,
  cartStatus,
  onAddToCart,
  buySectionRef,
}: StickyMobileBuyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = buySectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when the in-page button scrolls OUT of view
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [buySectionRef]);

  const { Icon, label } = ICON_MAP[cartStatus];
  const isDisabled =
    !selectedVariant.available ||
    cartStatus === 'loading' ||
    cartStatus === 'success';

  return (
    <div
      className={clsx(
        /* Only render on mobile (md and below) */
        'fixed bottom-0 left-0 right-0 z-40 md:hidden',
        'transition-transform duration-300 ease-out will-change-transform',
        isVisible ? 'translate-y-0' : 'translate-y-full',
      )}
      aria-hidden={!isVisible}
    >
      {/* Safe area for notched phones */}
      <div className="border-t border-stone-200 bg-ka-cream/95 backdrop-blur-md px-4 pb-safe pt-3 pb-3">
        <div className="flex items-center gap-3">
          {/* Variant + price summary */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ka-bark">
              {selectedVariant.title} — {selectedVariant.capsules} caps
            </p>
            <p className="text-xs text-stone-500">
              {selectedVariant.priceDisplay} · {selectedVariant.perDayDisplay}
            </p>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isDisabled}
            aria-label={label}
            className={clsx(
              'flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-3',
              'text-sm font-semibold text-white select-none',
              'transition-all duration-150 active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2',
              cartStatus === 'idle'    && 'bg-ka-green-600 hover:bg-ka-green-700',
              cartStatus === 'loading' && 'bg-ka-green-500 cursor-not-allowed',
              cartStatus === 'success' && 'bg-ka-green-700 cursor-default',
              cartStatus === 'error'   && 'bg-red-600 hover:bg-red-700',
              isDisabled && cartStatus !== 'success' && 'opacity-80',
            )}
          >
            <Icon
              size={17}
              className={clsx(
                cartStatus === 'loading' && 'animate-spin',
                cartStatus === 'success' && 'text-ka-gold-300 animate-bounce-in',
              )}
              aria-hidden="true"
            />
            <span key={cartStatus} className="animate-slide-up-fade">
              {label}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
