export interface WishlistItem {
  variantId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  priceCents: number;
  priceDisplay: string;
  capsules: number;
  available: boolean;
  tag?: string;
  addedAt: string;
}

export interface WishlistResult {
  sessionId: string;
  items: WishlistItem[];
  count: number;
}

export interface WishlistMutationResult extends WishlistResult {
  added?: boolean;
  removed?: boolean;
}

export interface WishlistCheckResult {
  wishlisted: boolean;
}
