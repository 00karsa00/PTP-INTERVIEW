"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
    },
    shopify: {
        storeDomain: process.env.SHOPIFY_STORE_DOMAIN || '',
        adminApiToken: process.env.SHOPIFY_ADMIN_API_TOKEN || '',
    },
});
//# sourceMappingURL=configuration.js.map