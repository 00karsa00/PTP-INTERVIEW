"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
function variant(id, title, priceCents, available = true) {
    const rupees = priceCents / 100;
    return {
        id,
        title,
        priceCents,
        priceDisplay: '₹' + rupees.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
        available,
    };
}
const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;
const CATALOGUE = [
    {
        handle: 'ashwagandha',
        title: 'Ashwagandha Capsules',
        subtitle: '600 mg organic root extract • adaptogen for stress & energy',
        category: 'adaptogen',
        categoryLabel: 'Adaptogen',
        imageUrl: IMG('1471864190702-a651b1f01a04'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQQBBQEAAAAAAAAAAAAAAQACAwQFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmNi1aLFqoq5JV3JUlQkbHZskhO91sTYdFpGvO4R7VfX56RERERERERERf//Z',
        rating: 4.7,
        reviewCount: 342,
        defaultVariant: variant('ashwagandha-60', '60 Capsules', 291600),
        variants: [
            variant('ashwagandha-30', '30 Capsules', 166500),
            variant('ashwagandha-60', '60 Capsules', 291600),
            variant('ashwagandha-90', '90 Capsules', 399800),
        ],
        tags: ['stress', 'energy', 'focus', 'bestseller'],
        featured: true,
        dataSource: 'mocked',
    },
    {
        handle: 'brahmi',
        title: 'Brahmi Capsules',
        subtitle: '500 mg Bacopa monnieri extract • cognitive support & memory',
        category: 'adaptogen',
        categoryLabel: 'Adaptogen',
        imageUrl: IMG('1556909114-5a7a5b30c8f3'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAHhAAAgIDAQEBAAAAAAAAAAAAAQIDBAUREiEx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJ2TkPbVyvXs2rliVpJHaWWRpGOSck5JJJJJJJJJJJJJJJJJP//Z',
        rating: 4.5,
        reviewCount: 218,
        defaultVariant: variant('brahmi-60', '60 Capsules', 249900),
        variants: [
            variant('brahmi-60', '60 Capsules', 249900),
            variant('brahmi-90', '90 Capsules', 349800),
        ],
        tags: ['memory', 'focus', 'brain health'],
        featured: true,
        dataSource: 'mocked',
    },
    {
        handle: 'triphala',
        title: 'Triphala Tablets',
        subtitle: 'Classic 3-fruit formula • digestive wellness & detox',
        category: 'digestion',
        categoryLabel: 'Digestion',
        imageUrl: IMG('1512621776951-a57ef384aff1'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQYD/8QAIRAAAQQBBAMAAAAAAAAAAAAAAQACAxEEBRIhMWH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.6,
        reviewCount: 407,
        defaultVariant: variant('triphala-60', '60 Tablets', 199000),
        variants: [
            variant('triphala-60', '60 Tablets', 199000),
            variant('triphala-120', '120 Tablets', 349900),
        ],
        tags: ['gut health', 'detox', 'digestion', 'bestseller'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'turmeric-piperine',
        title: 'Turmeric & Piperine Capsules',
        subtitle: '500 mg curcumin + 5 mg piperine • anti-inflammatory support',
        category: 'immunity',
        categoryLabel: 'Immunity',
        imageUrl: IMG('1615485500834-ba2da4ec0b32'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAYD/8QAIBAAAQQBBQEAAAAAAAAAAAAAAQACAxEEBSExQf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.4,
        reviewCount: 189,
        defaultVariant: variant('turmeric-60', '60 Capsules', 224900),
        variants: [
            variant('turmeric-60', '60 Capsules', 224900),
            variant('turmeric-90', '90 Capsules', 319900),
        ],
        tags: ['immunity', 'inflammation', 'joints'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'shatavari',
        title: 'Shatavari Capsules',
        subtitle: '500 mg Asparagus racemosus • women\'s hormonal wellness',
        category: 'womens_health',
        categoryLabel: "Women's Health",
        imageUrl: IMG('1471193954898-fd5c2b70bbd3'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAHhAAAQQCAwEAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.3,
        reviewCount: 156,
        defaultVariant: variant('shatavari-60', '60 Capsules', 259900),
        variants: [
            variant('shatavari-60', '60 Capsules', 259900),
        ],
        tags: ["women's health", 'hormonal balance', 'vitality'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'neem',
        title: 'Neem Capsules',
        subtitle: 'Pure Azadirachta indica leaf extract • skin clarity & blood purification',
        category: 'skincare',
        categoryLabel: 'Skincare',
        imageUrl: IMG('1607305166823-5cb6db31d0db'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMG/8QAHhAAAQQBBQAAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.2,
        reviewCount: 203,
        defaultVariant: variant('neem-60', '60 Capsules', 179900),
        variants: [
            variant('neem-60', '60 Capsules', 179900),
            variant('neem-120', '120 Capsules', 329900),
        ],
        tags: ['skin', 'acne', 'blood purifier'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'guduchi',
        title: 'Guduchi (Giloy) Capsules',
        subtitle: 'Tinospora cordifolia extract • immune modulator & fever support',
        category: 'immunity',
        categoryLabel: 'Immunity',
        imageUrl: IMG('1559181567-b6e0c8c3e58a'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQME/8QAHhAAAQQBBQAAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.5,
        reviewCount: 271,
        defaultVariant: variant('guduchi-60', '60 Capsules', 209900),
        variants: [
            variant('guduchi-60', '60 Capsules', 209900),
            variant('guduchi-90', '90 Capsules', 299900),
        ],
        tags: ['immunity', 'fever', 'anti-inflammatory'],
        featured: true,
        dataSource: 'mocked',
    },
    {
        handle: 'bhringraj',
        title: 'Bhringraj Capsules',
        subtitle: 'Eclipta alba extract • traditional hair nourishment & scalp support',
        category: 'hair',
        categoryLabel: 'Hair Care',
        imageUrl: IMG('1522337360396-e18a7b4c5e1c'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQME/8QAHhAAAQUAAwEAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.1,
        reviewCount: 134,
        defaultVariant: variant('bhringraj-60', '60 Capsules', 219900),
        variants: [
            variant('bhringraj-60', '60 Capsules', 219900),
        ],
        tags: ['hair', 'scalp', 'hairfall'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'tagara',
        title: 'Tagara Sleep Capsules',
        subtitle: 'Valeriana wallichii extract • traditional support for restful sleep',
        category: 'sleep',
        categoryLabel: 'Sleep',
        imageUrl: IMG('1540206395-68978144-9bcc-4cf1-956f-efe6e5e08d8b'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAMF/8QAHhAAAQUAAwEAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.4,
        reviewCount: 198,
        defaultVariant: variant('tagara-60', '60 Capsules', 239900),
        variants: [
            variant('tagara-60', '60 Capsules', 239900),
            variant('tagara-90', '90 Capsules', 339900),
        ],
        tags: ['sleep', 'relaxation', 'calm'],
        featured: false,
        dataSource: 'mocked',
    },
    {
        handle: 'boswellia',
        title: 'Boswellia Capsules',
        subtitle: 'Shallaki (Boswellia serrata) extract • joint mobility & comfort',
        category: 'joint',
        categoryLabel: 'Joint Care',
        imageUrl: IMG('1559839914-17aae19cec0a'),
        imagePlaceholder: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABQQG/8QAHhAAAQUAAwEAAAAAAAAAAAAAAQACAxEEBSExUf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmcRILNiRkQ5yHqvVN4TrCDqp+dVJGpSqFWRIqxqcbJAJJJJJJJJJJJJJJJJP//Z',
        rating: 4.3,
        reviewCount: 167,
        defaultVariant: variant('boswellia-60', '60 Capsules', 279900),
        variants: [
            variant('boswellia-60', '60 Capsules', 279900),
            variant('boswellia-90', '90 Capsules', 389900),
        ],
        tags: ['joints', 'mobility', 'arthritis support'],
        featured: false,
        dataSource: 'mocked',
    },
];
let MarketplaceService = class MarketplaceService {
    getProducts(filters) {
        let products = [...CATALOGUE];
        if (filters?.category) {
            products = products.filter((p) => p.category === filters.category);
        }
        if (filters?.featuredOnly) {
            products = products.filter((p) => p.featured);
        }
        return { products, total: products.length, dataSource: 'mocked' };
    }
    getProduct(handle) {
        return CATALOGUE.find((p) => p.handle === handle) ?? null;
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)()
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map