import { AddWishlistItemDto, RemoveWishlistItemDto } from './dto/wishlist-item.dto';
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
export declare class WishlistService {
    private readonly logger;
    private readonly store;
    getWishlist(sessionId: string): WishlistResult;
    addItem(dto: AddWishlistItemDto): WishlistResult & {
        added: boolean;
    };
    removeItem(dto: RemoveWishlistItemDto): WishlistResult & {
        removed: boolean;
    };
    isWishlisted(sessionId: string, variantId: string, productHandle: string): boolean;
}
