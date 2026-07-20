export declare class AddWishlistItemDto {
    sessionId: string;
    variantId: string;
    variantTitle: string;
    productHandle: string;
    productTitle: string;
    priceCents: number;
    priceDisplay: string;
    capsules: number;
    available: boolean;
    tag?: string;
}
export declare class RemoveWishlistItemDto {
    sessionId: string;
    variantId: string;
    productHandle: string;
}
