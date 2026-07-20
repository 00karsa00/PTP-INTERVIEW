import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './dto/wishlist-item.dto';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(sessionId: string): import("./wishlist.service").WishlistResult;
    checkItem(sessionId: string, variantId: string, productHandle: string): {
        wishlisted: boolean;
    };
    addItem(dto: AddWishlistItemDto): import("./wishlist.service").WishlistResult & {
        added: boolean;
    };
    removeItem(dto: RemoveWishlistItemDto): import("./wishlist.service").WishlistResult & {
        removed: boolean;
    };
}
