import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto, RemoveWishlistItemDto } from './dto/wishlist-item.dto';

/**
 * Wishlist Controller
 *
 * GET    /api/v1/wishlist?sessionId=xxx
 *   → { items: [...], count: N }
 *
 * POST   /api/v1/wishlist
 *   body: AddWishlistItemDto
 *   → { items: [...], count: N, added: boolean }
 *
 * DELETE /api/v1/wishlist
 *   body: RemoveWishlistItemDto
 *   → { items: [...], count: N, removed: boolean }
 *
 * GET    /api/v1/wishlist/check?sessionId=xxx&variantId=yyy&productHandle=zzz
 *   → { wishlisted: boolean }
 *
 * All responses are wrapped by ResponseInterceptor:
 *   { success: true, data: <above>, timestamp: "..." }
 */
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /** Retrieve all wishlist items for a session */
  @Get()
  getWishlist(@Query('sessionId') sessionId: string) {
    if (!sessionId?.trim()) {
      throw new BadRequestException('sessionId query parameter is required');
    }
    return this.wishlistService.getWishlist(sessionId.trim());
  }

  /** Check if a specific variant is wishlisted */
  @Get('check')
  checkItem(
    @Query('sessionId') sessionId: string,
    @Query('variantId') variantId: string,
    @Query('productHandle') productHandle: string,
  ) {
    if (!sessionId?.trim() || !variantId?.trim() || !productHandle?.trim()) {
      throw new BadRequestException(
        'sessionId, variantId, and productHandle query parameters are required',
      );
    }
    const wishlisted = this.wishlistService.isWishlisted(
      sessionId.trim(),
      variantId.trim(),
      productHandle.trim(),
    );
    return { wishlisted };
  }

  /** Add a variant to the wishlist */
  @Post()
  @HttpCode(HttpStatus.OK)
  addItem(@Body() dto: AddWishlistItemDto) {
    return this.wishlistService.addItem(dto);
  }

  /** Remove a variant from the wishlist */
  @Delete()
  @HttpCode(HttpStatus.OK)
  removeItem(@Body() dto: RemoveWishlistItemDto) {
    return this.wishlistService.removeItem(dto);
  }
}
