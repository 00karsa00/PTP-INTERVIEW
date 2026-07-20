import { Injectable } from '@nestjs/common';

/**
 * Product data service.
 *
 * STATUS — MOCKED / ASSUMED (clearly labelled per assignment brief):
 *   - Variant tiers (30/60/90 caps) are invented for the assignment.
 *     Real product ships as a single 60-cap SKU.
 *   - Prices are illustrative — not from live Shopify Storefront API.
 *   - Benefit copy is rewritten from real listing content (keralaayurveda.store).
 *   - Ingredient data is real (from Amazon listing).
 *
 * In production this service would:
 *   1. Call the Shopify Storefront API (or Admin API) for live price/inventory.
 *   2. Read benefit bullets from product metafields via Admin API.
 *   3. Cache the response with a short TTL (e.g. 5 min via Redis or in-memory).
 */

export interface ProductVariant {
  id: string;
  title: string;
  capsules: number;
  priceCents: number;       // USD cents
  priceDisplay: string;
  perDayDisplay: string;
  tag: string | null;
  available: boolean;
}

export interface ProductBenefit {
  icon: string;             // lucide icon name for the frontend
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

const ASHWAGANDHA: ProductData = {
  handle: 'ashwagandha',
  title: 'Ashwagandha Capsules',
  subtitle:
    'Organic ashwagandha root extract, 600 mg per capsule. Formulated as a traditional adaptogen to support your body\'s natural response to stress, energy, and sleep.',

  // ASSUMED — real product ships as one 60-cap SKU; tiers invented for assignment
  // Prices are in INR paise (1 INR = 100 paise). Illustrative only.
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

  // REAL — rewritten from keralaayurveda.store listing; no treatment claims
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

  // REAL — from Amazon listing
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

  // REAL — required FDA disclaimer
  disclaimer:
    'These statements have not been evaluated by the Food and Drug Administration. ' +
    'This product is not intended to diagnose, treat, cure, or prevent any disease. ' +
    'Consult a qualified healthcare professional before use, especially if you are ' +
    'pregnant, nursing, taking any medication, or have a medical condition.',

  dataSource: 'mocked',
};

@Injectable()
export class ProductsService {
  /**
   * Returns product data for the given handle.
   * Currently returns hardcoded data; in production would query Shopify APIs.
   */
  getProduct(handle: string): ProductData | null {
    if (handle === 'ashwagandha') return ASHWAGANDHA;
    return null;
  }
}
