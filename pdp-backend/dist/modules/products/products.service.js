"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const ASHWAGANDHA = {
    handle: 'ashwagandha',
    title: 'Ashwagandha Capsules',
    subtitle: 'Organic ashwagandha root extract, 600 mg per capsule. Formulated as a traditional adaptogen to support your body\'s natural response to stress, energy, and sleep.',
    variants: [
        {
            id: 'starter-30',
            title: 'Starter',
            capsules: 30,
            priceCents: 166500,
            priceDisplay: '₹1,665',
            perDayDisplay: '~₹55.5/day',
            tag: 'Try first',
            available: true,
        },
        {
            id: 'standard-60',
            title: 'Standard',
            capsules: 60,
            priceCents: 291600,
            priceDisplay: '₹2,916',
            perDayDisplay: '~₹48.6/day',
            tag: 'Most popular',
            available: true,
        },
        {
            id: 'value-90',
            title: 'Value',
            capsules: 90,
            priceCents: 399800,
            priceDisplay: '₹3,998',
            perDayDisplay: '~₹44.4/day',
            tag: 'Best value',
            available: true,
        },
    ],
    benefits: [
        {
            icon: 'Leaf',
            heading: 'Adaptogenic support',
            body: "Ashwagandha is traditionally used as an adaptogen to support the body's natural response to everyday stress.",
        },
        {
            icon: 'Zap',
            heading: 'Energy & focus',
            body: 'Formulated to support sustained energy and mental clarity throughout the day.',
        },
        {
            icon: 'Moon',
            heading: 'Restful evenings',
            body: 'Traditionally used in evening routines to support a sense of calm and restful sleep.',
        },
        {
            icon: 'Shield',
            heading: 'Clean formulation',
            body: '600 mg organic ashwagandha root extract per capsule. No artificial fillers or additives.',
        },
        {
            icon: 'Award',
            heading: 'Since 1945',
            body: "From Kerala Ayurveda — rooted in Ayurvedic tradition with over 75 years of practice.",
        },
    ],
    ingredients: [
        {
            name: 'Ashwagandha Root Extract',
            amount: '600 mg',
            role: 'Adaptogenic herb standardised for withanolide content (active constituents)',
        },
        {
            name: 'Capsule Shell',
            amount: 'Vegetarian HPMC',
            role: 'Plant-derived capsule — no gelatin',
        },
    ],
    trustSignals: [
        '600 mg organic root extract per capsule',
        'No artificial fillers or synthetic additives',
        'Vegetarian capsules',
        'Kerala Ayurveda heritage since 1945',
    ],
    disclaimer: 'These statements have not been evaluated by the Food and Drug Administration. ' +
        'This product is not intended to diagnose, treat, cure, or prevent any disease. ' +
        'Consult a qualified healthcare professional before use, especially if you are ' +
        'pregnant, nursing, taking any medication, or have a medical condition.',
    dataSource: 'mocked',
};
let ProductsService = class ProductsService {
    getProduct(handle) {
        if (handle === 'ashwagandha')
            return ASHWAGANDHA;
        return null;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map