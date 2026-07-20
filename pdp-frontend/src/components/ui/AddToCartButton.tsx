import React from 'react';
import { clsx } from 'clsx';
import { ShoppingBag, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type CartStatus = 'idle' | 'loading' | 'success' | 'error';

interface AddToCartButtonProps {
  status: CartStatus;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const STATES = {
  idle: {
    icon: ShoppingBag,
    label: 'Add to Cart',
    bg: 'bg-ka-green-600 hover:bg-ka-green-700 active:bg-ka-green-800 active:scale-[0.98]',
    spin: false,
  },
  loading: {
    icon: Loader2,
    label: 'Adding…',
    bg: 'bg-ka-green-500 cursor-not-allowed',
    spin: true,
  },
  success: {
    icon: CheckCircle,
    label: 'Added to Cart',
    bg: 'bg-ka-green-700 cursor-default',
    spin: false,
  },
  error: {
    icon: AlertCircle,
    label: 'Try again',
    bg: 'bg-red-600 hover:bg-red-700 active:scale-[0.98]',
    spin: false,
  },
} as const;

export function AddToCartButton({
  status,
  onClick,
  disabled,
  className,
}: AddToCartButtonProps) {
  const state = STATES[status];
  const Icon = state.icon;
  const isDisabled = disabled || status === 'loading' || status === 'success';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-live="polite"
      aria-label={state.label}
      className={clsx(
        'relative flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4',
        'text-base font-semibold text-white select-none',
        'transition-all duration-200 ease-out',
        'focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2 focus-visible:outline-none',
        state.bg,
        isDisabled && status !== 'success' && 'opacity-90',
        status === 'success' && 'animate-pulse-ring',
        className,
      )}
    >
      {/* Icon slot — bounce-in on success, spin on loading */}
      <span
        className={clsx(
          'flex-shrink-0',
          status === 'success' && 'animate-bounce-in',
          status === 'error' && 'animate-scale-in',
        )}
        aria-hidden="true"
      >
        <Icon
          size={20}
          className={clsx(
            'transition-transform duration-200',
            state.spin && 'animate-spin',
            status === 'success' && 'text-ka-gold-300',
          )}
        />
      </span>

      {/* Label — fades between states */}
      <span
        key={status} // remount to re-trigger fade-in on every state change
        className="animate-slide-up-fade"
      >
        {state.label}
      </span>

      {/* Loading progress bar */}
      {status === 'loading' && (
        <span
          className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-xl"
          aria-hidden="true"
        >
          <span className="block h-full w-1/3 animate-[shimmer_1s_linear_infinite] bg-white/40 rounded-full" />
        </span>
      )}
    </button>
  );
}
