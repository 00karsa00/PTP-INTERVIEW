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
export interface RecommendResponseDto {
    goal: string;
    frequency: string;
    blurb: string;
    pack: PackRecommendation;
    routine: RoutineStep[];
    disclaimer: string;
    blurbSource: 'ai' | 'fallback';
}
