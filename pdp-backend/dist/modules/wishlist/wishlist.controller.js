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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const wishlist_service_1 = require("./wishlist.service");
const wishlist_item_dto_1 = require("./dto/wishlist-item.dto");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    getWishlist(sessionId) {
        if (!sessionId?.trim()) {
            throw new common_1.BadRequestException('sessionId query parameter is required');
        }
        return this.wishlistService.getWishlist(sessionId.trim());
    }
    checkItem(sessionId, variantId, productHandle) {
        if (!sessionId?.trim() || !variantId?.trim() || !productHandle?.trim()) {
            throw new common_1.BadRequestException('sessionId, variantId, and productHandle query parameters are required');
        }
        const wishlisted = this.wishlistService.isWishlisted(sessionId.trim(), variantId.trim(), productHandle.trim());
        return { wishlisted };
    }
    addItem(dto) {
        return this.wishlistService.addItem(dto);
    }
    removeItem(dto) {
        return this.wishlistService.removeItem(dto);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Get)('check'),
    __param(0, (0, common_1.Query)('sessionId')),
    __param(1, (0, common_1.Query)('variantId')),
    __param(2, (0, common_1.Query)('productHandle')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "checkItem", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wishlist_item_dto_1.AddWishlistItemDto]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addItem", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wishlist_item_dto_1.RemoveWishlistItemDto]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeItem", null);
exports.WishlistController = WishlistController = __decorate([
    (0, common_1.Controller)('wishlist'),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map