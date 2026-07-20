"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WishlistService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const MAX_ITEMS_PER_SESSION = 20;
let WishlistService = WishlistService_1 = class WishlistService {
    constructor() {
        this.logger = new common_1.Logger(WishlistService_1.name);
        this.store = new Map();
    }
    getWishlist(sessionId) {
        const items = this.store.get(sessionId) ?? [];
        return { sessionId, items, count: items.length };
    }
    addItem(dto) {
        const items = this.store.get(dto.sessionId) ?? [];
        const alreadyExists = items.some((i) => i.variantId === dto.variantId && i.productHandle === dto.productHandle);
        if (alreadyExists) {
            this.logger.debug(`Wishlist add skipped — variant ${dto.variantId} already present for session ${dto.sessionId}`);
            return { sessionId: dto.sessionId, items, count: items.length, added: false };
        }
        if (items.length >= MAX_ITEMS_PER_SESSION) {
            this.logger.warn(`Wishlist full for session ${dto.sessionId} (${MAX_ITEMS_PER_SESSION} item cap)`);
            return { sessionId: dto.sessionId, items, count: items.length, added: false };
        }
        const newItem = {
            variantId: dto.variantId,
            variantTitle: dto.variantTitle,
            productHandle: dto.productHandle,
            productTitle: dto.productTitle,
            priceCents: dto.priceCents,
            priceDisplay: dto.priceDisplay,
            capsules: dto.capsules,
            available: dto.available,
            tag: dto.tag,
            addedAt: new Date().toISOString(),
        };
        const updated = [...items, newItem];
        this.store.set(dto.sessionId, updated);
        this.logger.log(`Wishlist: added ${dto.variantId} for session ${dto.sessionId} (total ${updated.length})`);
        return { sessionId: dto.sessionId, items: updated, count: updated.length, added: true };
    }
    removeItem(dto) {
        const items = this.store.get(dto.sessionId) ?? [];
        const before = items.length;
        const updated = items.filter((i) => !(i.variantId === dto.variantId && i.productHandle === dto.productHandle));
        const removed = updated.length < before;
        if (removed) {
            this.store.set(dto.sessionId, updated);
            this.logger.log(`Wishlist: removed ${dto.variantId} for session ${dto.sessionId} (total ${updated.length})`);
        }
        return { sessionId: dto.sessionId, items: updated, count: updated.length, removed };
    }
    isWishlisted(sessionId, variantId, productHandle) {
        const items = this.store.get(sessionId) ?? [];
        return items.some((i) => i.variantId === variantId && i.productHandle === productHandle);
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = WishlistService_1 = __decorate([
    (0, common_1.Injectable)()
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map