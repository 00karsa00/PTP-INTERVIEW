import {
  Controller,
  Get,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';

/**
 * GET /api/v1/products/:handle
 *
 * Returns product catalogue data (variants, benefits, ingredients, trust signals).
 * The frontend calls this on mount so all content comes from one source of truth
 * rather than being split between frontend constants and backend templates.
 *
 * Example:
 *   GET /api/v1/products/ashwagandha
 *   → { success: true, data: { title, variants, benefits, ... } }
 *
 * 404 if the handle is not recognised.
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':handle')
  @HttpCode(HttpStatus.OK)
  getProduct(@Param('handle') handle: string) {
    const product = this.productsService.getProduct(handle.toLowerCase().trim());
    if (!product) {
      throw new NotFoundException(`Product '${handle}' not found`);
    }
    return product;
  }
}
