import { Injectable, Logger } from '@nestjs/common';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './dto/wishlist-item.dto';

/**
 * Wishlist Service
 *
 * STATUS — IN-MEMORY STORE (clearly labelled per assignment brief):
 *   - Items are stored in a Map<sessionId, WishlistItem[]> in process memory.
 *   - Data does NOT persist across server restarts.
 *   - There is NO authentication — sessionId is an anonymous identifier
 *     generated on the client and stored in localStorage.
 *   - A per-session item cap (MAX_ITEMS_PER_SESSION) prevents unbounded growth.
 *
 * In production this service would:
 *   1. Use a database (e.g. PostgreSQL via TypeORM / Prisma).
 *   2. Tie wishlists to authenticated user accounts.
 *   3. Support pagination for large wishlists.
 *   4. Add TTL-based eviction for anonymous sessions.
 *
 * Business logic is intentionally separate from the controller layer
 * so it can be unit-tested independently.
 */

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
  addedAt: string; // ISO timestamp
}

export interface WishlistResult {
  sessionId: string;
  items: WishlistItem[];
  count: number;
}

const MAX_ITEMS_PER_SESSION = 20;

@Injectable()
export class WishlistService {
  private readonly logger = new Logger(WishlistService.name);

  /**
   * In-memory store.
   * Key: sessionId (opaque string from client)
   * Value: array of wishlist items
   *
   * DATA SOURCE: in-memory — not persisted to disk or database.
   */
  private readonly store = new Map<string, WishlistItem[]>();

  /**
   * Returns the wishlist for a given session.
   * Always succeeds — returns empty list if session has no items.
   */
  getWishlist(sessionId: string): WishlistResult {
    const items = this.store.get(sessionId) ?? [];
    return { sessionId, items, count: items.length };
  }

  /**
   * Adds a product variant to the wishlist.
   * Idempotent — adding an already-wishlisted item is a no-op.
   * Returns the updated wishlist.
   */
  addItem(dto: AddWishlistItemDto): WishlistResult & { added: boolean } {
    const items = this.store.get(dto.sessionId) ?? [];

    // Check if this variant is already in the wishlist for this product
    const alreadyExists = items.some(
      (i) => i.variantId === dto.variantId && i.productHandle === dto.productHandle,
    );

    if (alreadyExists) {
      this.logger.debug(
        `Wishlist add skipped — variant ${dto.variantId} already present for session ${dto.sessionId}`,
      );
      return { sessionId: dto.sessionId, items, count: items.length, added: false };
    }

    if (items.length >= MAX_ITEMS_PER_SESSION) {
      this.logger.warn(
        `Wishlist full for session ${dto.sessionId} (${MAX_ITEMS_PER_SESSION} item cap)`,
      );
      // Still return the current list — controller decides on HTTP status
      return { sessionId: dto.sessionId, items, count: items.length, added: false };
    }

    const newItem: WishlistItem = {
      variantId: dto.variantId,
      variantTitle: dto.variantTitle,
      productHandle: dto.productHandle,
      productTitle: dto.productTitle,
      priceCents: dto.priceCents,
      priceDisplay: dto.priceDisplay,
      capsules: dto.capsules,
      available: dto.available,
      tag: dto.tag,
      addedAt: new Date().toISOString(),
    };

    const updated = [...items, newItem];
    this.store.set(dto.sessionId, updated);

    this.logger.log(
      `Wishlist: added ${dto.variantId} for session ${dto.sessionId} (total ${updated.length})`,
    );

    return { sessionId: dto.sessionId, items: updated, count: updated.length, added: true };
  }

  /**
   * Removes a product variant from the wishlist.
   * Idempotent — removing a non-existent item is a no-op.
   * Returns the updated wishlist.
   */
  removeItem(dto: RemoveWishlistItemDto): WishlistResult & { removed: boolean } {
    const items = this.store.get(dto.sessionId) ?? [];
    const before = items.length;

    const updated = items.filter(
      (i) => !(i.variantId === dto.variantId && i.productHandle === dto.productHandle),
    );

    const removed = updated.length < before;
    if (removed) {
      this.store.set(dto.sessionId, updated);
      this.logger.log(
        `Wishlist: removed ${dto.variantId} for session ${dto.sessionId} (total ${updated.length})`,
      );
    }

    return { sessionId: dto.sessionId, items: updated, count: updated.length, removed };
  }

  /**
   * Checks whether a specific variant is in the wishlist.
   * Used by the PDP to show the correct heart icon state on page load.
   */
  isWishlisted(sessionId: string, variantId: string, productHandle: string): boolean {
    const items = this.store.get(sessionId) ?? [];
    return items.some(
      (i) => i.variantId === variantId && i.productHandle === productHandle,
    );
  }
}
