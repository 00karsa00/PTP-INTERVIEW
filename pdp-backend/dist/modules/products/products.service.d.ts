export interface ProductVariant {
    id: string;
    title: string;
    capsules: number;
    priceCents: number;
    priceDisplay: string;
    perDayDisplay: string;
    tag: string | null;
    available: boolean;
}
export interface ProductBenefit {
    icon: string;
    heading: string;
    body: string;
}
export interface ProductIngredient {
    name: string;
    amount: string;
    role: string;
}
export interface ProductData {
    handle: string;
    title: string;
    subtitle: string;
    variants: ProductVariant[];
    benefits: ProductBenefit[];
    ingredients: ProductIngredient[];
    trustSignals: string[];
    disclaimer: string;
    dataSource: 'mocked' | 'live';
}
export declare class ProductsService {
    getProduct(handle: string): ProductData | null;
}
