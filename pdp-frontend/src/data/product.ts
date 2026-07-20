/**
 * REAL facts — sourced from Amazon listing and keralaayurveda.store
 * ASSUMED items are clearly labelled.
 */

export interface Variant {
  id: string;
  title: string;
  capsules: number;
  price: number;  // INR paise (1 INR = 100 paise)
  priceDisplay: string;
  perDayDisplay: string;
  tag?: string;
  available: boolean;
}

export interface Benefit {
  icon: string; // lucide icon name
  heading: string;
  body: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  role: string;
}

// ── Variants (ASSUMED — see README) ──────────────────────────────────────────
export const VARIANTS: Variant[] = [
  {
    id: 'starter-30',
    title: 'Starter',
    capsules: 30,
    price: 166500,       // ₹1,665 in paise
    priceDisplay: '₹1,665',
    perDayDisplay: '~₹55.5/day',
    tag: 'Try first',
    available: true,
  },
  {
    id: 'standard-60',
    title: 'Standard',
    capsules: 60,
    price: 291600,       // ₹2,916 in paise
    priceDisplay: '₹2,916',
    perDayDisplay: '~₹48.6/day',
    tag: 'Most popular',
    available: true,
  },
  {
    id: 'value-90',
    title: 'Value',
    capsules: 90,
    price: 399800,       // ₹3,998 in paise
    priceDisplay: '₹3,998',
    perDayDisplay: '~₹44.4/day',
    tag: 'Best value',
    available: true,
  },
];

// ── Benefit bullets (REAL — rewritten, sourced from listings) ─────────────────
export const BENEFITS: Benefit[] = [
  {
    icon: 'Leaf',
    heading: 'Adaptogenic support',
    body: 'Ashwagandha is traditionally used as an adaptogen to support the body\'s natural response to everyday stress.',
  },
  {
    icon: 'Zap',
    heading: 'Energy & focus',
    body: 'Formulated to support sustained energy and mental focus throughout the day.',
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
    body: 'From Kerala Ayurveda — rooted in Ayurvedic tradition with over 75 years of practice.',
  },
];

// ── Ingredients (REAL — from listing) ─────────────────────────────────────────
export const INGREDIENTS: Ingredient[] = [
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
];

// ── Trust signals ─────────────────────────────────────────────────────────────
export const TRUST_SIGNALS = [
  '600 mg organic root extract per capsule',
  'No artificial fillers or synthetic additives',
  'Vegetarian capsules',
  'Kerala Ayurveda heritage since 1945',
];

// ── FDA Disclaimer (REAL — required on all listings) ─────────────────────────
export const DISCLAIMER =
  'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before use, especially if you are pregnant, nursing, taking any medication, or have a medical condition.';
