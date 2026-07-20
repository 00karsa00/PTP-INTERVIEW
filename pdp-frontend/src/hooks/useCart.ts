import { useState, useCallback } from 'react';
import type { Variant } from '../data/product';

/**
 * Cart state management hook.
 *
 * STATUS — SIMULATED (clearly labelled per assignment brief):
 *   - Cart items live in React state only — not persisted anywhere.
 *   - In a real Shopify theme, the cart would call /cart/add.js (POST) and
 *     /cart.js (GET) against the Shopify Cart API.
 *   - Checkout is a no-op here; in prod it would redirect to /checkout.
 *
 * The hook intentionally mirrors the shape a real Shopify cart API would use
 * so replacing the implementation is straightforward.
 */

export interface CartItem {
  variantId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  priceCents: number;
  priceDisplay: string;
  capsules: number;
  available: boolean;
  tag?: string;
  quantity: number;
}

interface UseCartReturn {
  items: CartItem[];
  count: number;
  totalCents: number;
  totalDisplay: string;
  addItem: (variant: Variant, productHandle: string, productTitle: string) => void;
  removeItem: (variantId: string, productHandle: string) => void;
  updateQuantity: (variantId: string, productHandle: string, quantity: number) => void;
  clearCart: () => void;
}

/**
 * Formats INR paise to a display string, e.g. 291600 → "₹2,916"
 * Paise are divided by 100 then formatted with the Indian numbering system.
 */
function paiseToDisplay(paise: number): string {
  const rupees = paise / 100;
  return '₹' + rupees.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (variant: Variant, productHandle: string, productTitle: string) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.variantId === variant.id && i.productHandle === productHandle,
        );
        if (existing) {
          return prev.map((i) =>
            i.variantId === variant.id && i.productHandle === productHandle
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [
          ...prev,
          {
            variantId: variant.id,
            variantTitle: variant.title,
            productHandle,
            productTitle,
            priceCents: variant.price,
            priceDisplay: variant.priceDisplay,
            capsules: variant.capsules,
            available: variant.available,
            tag: variant.tag,
            quantity: 1,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((variantId: string, productHandle: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.variantId === variantId && i.productHandle === productHandle)),
    );
  }, []);

  const updateQuantity = useCallback(
    (variantId: string, productHandle: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((i) => !(i.variantId === variantId && i.productHandle === productHandle)),
        );
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.variantId === variantId && i.productHandle === productHandle
              ? { ...i, quantity }
              : i,
          ),
        );
      }
    },
    [],
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  return {
    items,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    totalCents,
    totalDisplay: paiseToDisplay(totalCents),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
