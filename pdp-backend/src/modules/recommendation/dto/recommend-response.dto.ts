export interface PackRecommendation {
  /** Variant title as it would appear in Shopify  */
  title: string;
  /** Capsule count in this pack */
  capsules: number;
  /** Supply duration in plain English */
  supply: string;
  /** Why this pack fits the user's frequency choice */
  rationale: string;
}

export interface RoutineStep {
  time: 'morning' | 'evening' | 'before_bed';
  label: string;
  instruction: string;
}

export interface RecommendResponseDto {
  goal: string;
  frequency: string;
  /** 2-3 sentence personalised blurb — AI-generated, falls back to template */
  blurb: string;
  pack: PackRecommendation;
  routine: RoutineStep[];
  /** Always present — mandatory FDA disclaimer */
  disclaimer: string;
  /** Indicates whether the blurb is AI-generated or the static fallback */
  blurbSource: 'ai' | 'fallback';
}
