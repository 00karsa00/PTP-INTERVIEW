import React from 'react';
import { Heart } from 'lucide-react';
import { clsx } from 'clsx';

interface WishlistButtonProps {
  isWishlisted: boolean;
  isLoading: boolean;
  onClick: () => void;
  className?: string;
  /** Shows just the icon without a label */
  iconOnly?: boolean;
}

/**
 * Heart-shaped wishlist toggle button.
 * Filled heart = wishlisted; outline = not wishlisted.
 * Animates on toggle and shows a loading state while the API call is in flight.
 */
export function WishlistButton({
  isWishlisted,
  isLoading,
  onClick,
  className,
  iconOnly = false,
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
      className={clsx(
        'flex items-center gap-2 rounded-xl border-2 px-4 py-3.5',
        'text-sm font-semibold transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ka-green-500',
        isWishlisted
          ? 'border-red-300 bg-red-50 text-red-600 hover:border-red-400 hover:bg-red-100 focus-visible:ring-red-400'
          : 'border-stone-200 bg-white text-stone-500 hover:border-red-200 hover:bg-red-50 hover:text-red-500',
        isLoading && 'cursor-wait opacity-70',
        className,
      )}
    >
      <Heart
        size={18}
        aria-hidden="true"
        className={clsx(
          'flex-shrink-0 transition-all duration-200',
          isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'fill-none',
          isLoading && 'animate-pulse',
        )}
      />
      {!iconOnly && (
        <span>
          {isLoading
            ? isWishlisted
              ? 'Removing…'
              : 'Saving…'
            : isWishlisted
              ? 'Wishlisted'
              : 'Wishlist'}
        </span>
      )}
    </button>
  );
}
