import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { ProductsModule } from './modules/products/products.module';
import { HealthModule } from './modules/health/health.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    // 30 requests / 60 s per IP — applied globally via APP_GUARD below
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 30 }]),
    RecommendationModule,
    ProductsModule,
    HealthModule,
    WishlistModule,
    MarketplaceModule,
  ],
  providers: [
    // Bind ThrottlerGuard globally so every controller is rate-limited
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
