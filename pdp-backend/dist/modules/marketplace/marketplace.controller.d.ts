import { MarketplaceService } from './marketplace.service';
export declare class MarketplaceController {
    private readonly marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    getProducts(category?: string, featured?: string): import("./marketplace.service").MarketplaceListResponse;
    getProduct(handle: string): import("./marketplace.service").MarketplaceProduct;
}
