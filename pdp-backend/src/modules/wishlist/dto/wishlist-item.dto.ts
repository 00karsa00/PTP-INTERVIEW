import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class AddWishlistItemDto {
  /**
   * The session/anonymous-user ID (from localStorage on the frontend).
   * In production this would be a verified user ID from your auth layer.
   */
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  /** Shopify variant ID — e.g. "standard-60" */
  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsString()
  @IsNotEmpty()
  variantTitle: string;

  @IsString()
  @IsNotEmpty()
  productHandle: string;

  @IsString()
  @IsNotEmpty()
  productTitle: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  priceCents: number;

  @IsString()
  @IsNotEmpty()
  priceDisplay: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  capsules: number;

  @IsBoolean()
  available: boolean;

  @IsOptional()
  @IsString()
  tag?: string;
}

export class RemoveWishlistItemDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  variantId: string;

  @IsString()
  @IsNotEmpty()
  productHandle: string;
}
