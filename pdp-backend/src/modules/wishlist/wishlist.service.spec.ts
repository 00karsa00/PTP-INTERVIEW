import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './dto/wishlist-item.dto';

/**
 * Unit tests for WishlistService core business logic.
 * No HTTP layer, no NestJS testing module — plain class instantiation.
 *
 * Covers:
 *  - Adding a new item
 *  - Idempotent add (duplicate returns added=false)
 *  - Removing an item
 *  - Idempotent remove (missing item returns removed=false)
 *  - Per-session isolation (sessionA items do not appear in sessionB)
 *  - isWishlisted state correctly reflects add/remove operations
 *  - Per-session item cap (MAX_ITEMS_PER_SESSION = 20)
 */

const BASE_ITEM: AddWishlistItemDto = {
  sessionId: 'sess-test-001',
  variantId: 'standard-60',
  variantTitle: 'Standard',
  productHandle: 'ashwagandha',
  productTitle: 'Ashwagandha Capsules',
  priceCents: 3499,
  priceDisplay: '$34.99',
  capsules: 60,
  available: true,
  tag: 'Most popular',
};

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(() => {
    // Fresh instance per test — isolated in-memory store
    service = new WishlistService();
  });

  // ── getWishlist ────────────────────────────────────────────────────────────

  it('returns empty wishlist for an unknown session', () => {
    const result = service.getWishlist('unknown-session');
    expect(result.items).toEqual([]);
    expect(result.count).toBe(0);
  });

  // ── addItem ────────────────────────────────────────────────────────────────

  it('adds a new item and returns added=true', () => {
    const result = service.addItem(BASE_ITEM);
    expect(result.added).toBe(true);
    expect(result.count).toBe(1);
    expect(result.items[0].variantId).toBe('standard-60');
    expect(result.items[0].productHandle).toBe('ashwagandha');
  });

  it('stores the correct item shape including addedAt timestamp', () => {
    const before = new Date();
    const result = service.addItem(BASE_ITEM);
    const after = new Date();

    const item = result.items[0];
    expect(item.variantId).toBe(BASE_ITEM.variantId);
    expect(item.productTitle).toBe(BASE_ITEM.productTitle);
    expect(item.priceCents).toBe(BASE_ITEM.priceCents);
    expect(item.capsules).toBe(BASE_ITEM.capsules);
    expect(item.available).toBe(BASE_ITEM.available);
    expect(item.tag).toBe(BASE_ITEM.tag);

    const addedAt = new Date(item.addedAt);
    expect(addedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    expect(addedAt.getTime()).toBeLessThanOrEqual(after.getTime());
  });

  it('returns added=false when the same variant is added twice (idempotent)', () => {
    service.addItem(BASE_ITEM);
    const second = service.addItem(BASE_ITEM);

    expect(second.added).toBe(false);
    expect(second.count).toBe(1); // still only one item
  });

  it('allows two different variants of the same product', () => {
    service.addItem(BASE_ITEM);
    const second = service.addItem({
      ...BASE_ITEM,
      variantId: 'starter-30',
      variantTitle: 'Starter',
      priceCents: 1999,
    });

    expect(second.added).toBe(true);
    expect(second.count).toBe(2);
  });

  it('allows the same variant for different products', () => {
    service.addItem(BASE_ITEM);
    const second = service.addItem({
      ...BASE_ITEM,
      productHandle: 'brahmi',
      productTitle: 'Brahmi Capsules',
    });

    expect(second.added).toBe(true);
    expect(second.count).toBe(2);
  });

  // ── removeItem ─────────────────────────────────────────────────────────────

  it('removes an existing item and returns removed=true', () => {
    service.addItem(BASE_ITEM);

    const dto: RemoveWishlistItemDto = {
      sessionId: BASE_ITEM.sessionId,
      variantId: BASE_ITEM.variantId,
      productHandle: BASE_ITEM.productHandle,
    };
    const result = service.removeItem(dto);

    expect(result.removed).toBe(true);
    expect(result.count).toBe(0);
    expect(result.items).toEqual([]);
  });

  it('returns removed=false when item was not in wishlist', () => {
    const dto: RemoveWishlistItemDto = {
      sessionId: 'sess-test-001',
      variantId: 'nonexistent-sku',
      productHandle: 'ashwagandha',
    };
    const result = service.removeItem(dto);

    expect(result.removed).toBe(false);
    expect(result.count).toBe(0);
  });

  it('only removes the matching item, leaving others intact', () => {
    service.addItem(BASE_ITEM);
    service.addItem({ ...BASE_ITEM, variantId: 'value-90', variantTitle: 'Value' });

    const result = service.removeItem({
      sessionId: BASE_ITEM.sessionId,
      variantId: 'standard-60',
      productHandle: 'ashwagandha',
    });

    expect(result.removed).toBe(true);
    expect(result.count).toBe(1);
    expect(result.items[0].variantId).toBe('value-90');
  });

  // ── isWishlisted ───────────────────────────────────────────────────────────

  it('returns false before item is added', () => {
    expect(service.isWishlisted('sess-test-001', 'standard-60', 'ashwagandha')).toBe(false);
  });

  it('returns true after item is added', () => {
    service.addItem(BASE_ITEM);
    expect(service.isWishlisted('sess-test-001', 'standard-60', 'ashwagandha')).toBe(true);
  });

  it('returns false after item is removed', () => {
    service.addItem(BASE_ITEM);
    service.removeItem({
      sessionId: BASE_ITEM.sessionId,
      variantId: BASE_ITEM.variantId,
      productHandle: BASE_ITEM.productHandle,
    });
    expect(service.isWishlisted('sess-test-001', 'standard-60', 'ashwagandha')).toBe(false);
  });

  // ── Session isolation ──────────────────────────────────────────────────────

  it('keeps wishlists isolated between sessions', () => {
    service.addItem(BASE_ITEM); // sess-test-001

    const resultA = service.getWishlist('sess-test-001');
    const resultB = service.getWishlist('sess-test-002');

    expect(resultA.count).toBe(1);
    expect(resultB.count).toBe(0);
  });

  it('does not affect other sessions when removing an item', () => {
    service.addItem(BASE_ITEM); // sess-test-001
    service.addItem({ ...BASE_ITEM, sessionId: 'sess-test-002' });

    service.removeItem({
      sessionId: 'sess-test-001',
      variantId: BASE_ITEM.variantId,
      productHandle: BASE_ITEM.productHandle,
    });

    expect(service.getWishlist('sess-test-001').count).toBe(0);
    expect(service.getWishlist('sess-test-002').count).toBe(1);
  });

  // ── Per-session cap ────────────────────────────────────────────────────────

  it('does not add items beyond the 20-item cap', () => {
    // Add 20 distinct variants
    for (let i = 0; i < 20; i++) {
      service.addItem({ ...BASE_ITEM, variantId: `variant-${i}` });
    }

    const overCap = service.addItem({ ...BASE_ITEM, variantId: 'variant-over-cap' });
    expect(overCap.added).toBe(false);
    expect(overCap.count).toBe(20);
  });
});
