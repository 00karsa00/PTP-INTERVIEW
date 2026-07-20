import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProduct(handle: string): import("./products.service").ProductData;
}
