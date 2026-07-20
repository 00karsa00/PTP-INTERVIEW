import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { IsOptional, IsIn, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { MarketplaceService, ProductCategory } from './marketplace.service';

/**
 * Marketplace Controller
 *
 * GET /api/v1/marketplace
 *   ?category=adaptogen|immunity|digestion|skincare|hair|sleep|joint|womens_health
 *   ?featured=true
 *   → { products: [...], total: N, dataSource: "mocked" }
 *
 * GET /api/v1/marketplace/:handle
 *   → single product or 404
 *
 * All responses wrapped by ResponseInterceptor:
 *   { success: true, data: <above>, timestamp: "..." }
 */

const VALID_CATEGORIES: ProductCategory[] = [
  'adaptogen',
  'immunity',
  'digestion',
  'skincare',
  'hair',
  'sleep',
  'joint',
  'womens_health',
];

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  getProducts(
    @Query('category') category?: string,
    @Query('featured') featured?: string,
  ) {
    const validCategory =
      category && VALID_CATEGORIES.includes(category as ProductCategory)
        ? (category as ProductCategory)
        : undefined;

    const featuredOnly = featured === 'true' ? true : undefined;

    return this.marketplaceService.getProducts({
      category: validCategory,
      featuredOnly,
    });
  }

  @Get(':handle')
  getProduct(@Param('handle') handle: string) {
    const product = this.marketplaceService.getProduct(handle.toLowerCase().trim());
    if (!product) {
      throw new NotFoundException(`Marketplace product '${handle}' not found`);
    }
    return product;
  }
}
