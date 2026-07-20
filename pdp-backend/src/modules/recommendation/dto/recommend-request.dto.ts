import { IsEnum, IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * Goals map directly to benefit claims on real Kerala Ayurveda listings.
 * No invented health outcomes.
 */
export enum Goal {
  STRESS_CALM   = 'stress_calm',
  ENERGY_FOCUS  = 'energy_focus',
  SLEEP_QUALITY = 'sleep_quality',
}

export enum Frequency {
  ONCE_DAILY  = 'once_daily',
  TWICE_DAILY = 'twice_daily',
}

export class RecommendRequestDto {
  @IsEnum(Goal, {
    message: `goal must be one of: ${Object.values(Goal).join(', ')}`,
  })
  goal: Goal;

  @IsEnum(Frequency, {
    message: `frequency must be one of: ${Object.values(Frequency).join(', ')}`,
  })
  frequency: Frequency;

  /**
   * Optional free-text context the customer typed (e.g. "I travel a lot").
   * Passed to the AI to personalise the blurb — never echoed without sanitisation.
   * Hard-capped at 200 chars by both validation and service-level sanitisation.
   */
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'context must be 200 characters or fewer' })
  context?: string;
}
