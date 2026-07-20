export type ProductCategory = 'adaptogen' | 'immunity' | 'digestion' | 'skincare' | 'hair' | 'sleep' | 'joint' | 'womens_health';
export interface MarketplaceVariant {
    id: string;
    title: string;
    priceCents: number;
    priceDisplay: string;
    available: boolean;
}
export interface MarketplaceProduct {
    handle: string;
    title: string;
    subtitle: string;
    category: ProductCategory;
    categoryLabel: string;
    imageUrl: string;
    imagePlaceholder: string;
    rating: number;
    reviewCount: number;
    defaultVariant: MarketplaceVariant;
    variants: MarketplaceVariant[];
    tags: string[];
    featured: boolean;
    dataSource: 'mocked';
}
export interface MarketplaceListResponse {
    products: MarketplaceProduct[];
    total: number;
    dataSource: 'mocked';
}
export declare class MarketplaceService {
    getProducts(filters?: {
        category?: ProductCategory;
        featuredOnly?: boolean;
    }): MarketplaceListResponse;
    getProduct(handle: string): MarketplaceProduct | null;
}
