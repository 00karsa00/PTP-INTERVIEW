export declare enum Goal {
    STRESS_CALM = "stress_calm",
    ENERGY_FOCUS = "energy_focus",
    SLEEP_QUALITY = "sleep_quality"
}
export declare enum Frequency {
    ONCE_DAILY = "once_daily",
    TWICE_DAILY = "twice_daily"
}
export declare class RecommendRequestDto {
    goal: Goal;
    frequency: Frequency;
    context?: string;
}
