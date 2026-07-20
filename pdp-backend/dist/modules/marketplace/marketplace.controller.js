"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./marketplace.service");
const VALID_CATEGORIES = [
    'adaptogen',
    'immunity',
    'digestion',
    'skincare',
    'hair',
    'sleep',
    'joint',
    'womens_health',
];
let MarketplaceController = class MarketplaceController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    getProducts(category, featured) {
        const validCategory = category && VALID_CATEGORIES.includes(category)
            ? category
            : undefined;
        const featuredOnly = featured === 'true' ? true : undefined;
        return this.marketplaceService.getProducts({
            category: validCategory,
            featuredOnly,
        });
    }
    getProduct(handle) {
        const product = this.marketplaceService.getProduct(handle.toLowerCase().trim());
        if (!product) {
            throw new common_1.NotFoundException(`Marketplace product '${handle}' not found`);
        }
        return product;
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Get)(':handle'),
    __param(0, (0, common_1.Param)('handle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketplaceController.prototype, "getProduct", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map