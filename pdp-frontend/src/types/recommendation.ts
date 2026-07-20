export type Goal = 'stress_calm' | 'energy_focus' | 'sleep_quality';
export type Frequency = 'once_daily' | 'twice_daily';

export interface RecommendRequest {
  goal: Goal;
  frequency: Frequency;
  context?: string;
}

export interface PackRecommendation {
  title: string;
  capsules: number;
  supply: string;
  rationale: string;
}

export interface RoutineStep {
  time: 'morning' | 'evening' | 'before_bed';
  label: string;
  instruction: string;
}

export interface RecommendResponse {
  goal: string;
  frequency: string;
  blurb: string;
  pack: PackRecommendation;
  routine: RoutineStep[];
  disclaimer: string;
  blurbSource: 'ai' | 'fallback';
}

export interface ApiWrapper<T> {
  success: boolean;
  data: T;
  timestamp: string;
}
