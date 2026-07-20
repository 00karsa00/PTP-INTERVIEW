import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { RecommendRequestDto, Goal, Frequency } from './dto/recommend-request.dto';
import { RecommendResponseDto } from './dto/recommend-response.dto';
import {
  PACKS,
  ROUTINES,
  BLURB_FALLBACKS,
  GOAL_LABELS,
  FREQUENCY_LABELS,
  DISCLAIMER,
} from './data/routine-templates';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);
  private openai: OpenAI | null = null;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('openai.apiKey');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn(
        'OPENAI_API_KEY not set — AI blurbs will use static fallbacks.',
      );
    }
  }

  /**
   * Core recommendation logic.
   * Pure function of inputs → easy to unit-test without mocking I/O.
   */
  buildRecommendation(
    goal: Goal,
    frequency: Frequency,
  ): Omit<RecommendResponseDto, 'blurb' | 'blurbSource'> {
    return {
      goal: GOAL_LABELS[goal],
      frequency: FREQUENCY_LABELS[frequency],
      pack: PACKS[frequency],
      routine: ROUTINES[goal][frequency],
      disclaimer: DISCLAIMER,
    };
  }

  async getRecommendation(
    dto: RecommendRequestDto,
  ): Promise<RecommendResponseDto> {
    const base = this.buildRecommendation(dto.goal, dto.frequency);

    const { blurb, blurbSource } = await this.generateBlurb(
      dto.goal,
      dto.frequency,
      dto.context,
    );

    return { ...base, blurb, blurbSource };
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private async generateBlurb(
    goal: Goal,
    frequency: Frequency,
    context?: string,
  ): Promise<{ blurb: string; blurbSource: 'ai' | 'fallback' }> {
    if (!this.openai) {
      return { blurb: BLURB_FALLBACKS[goal], blurbSource: 'fallback' };
    }

    const goalLabel = GOAL_LABELS[goal];
    const freqLabel = FREQUENCY_LABELS[frequency];
    const pack = PACKS[frequency];
    const routine = ROUTINES[goal][frequency];
    const routineText = routine
      .map((r) => `${r.label}: ${r.instruction}`)
      .join(' ');

    // Sanitise optional free-text to prevent prompt injection
    const safeContext = context
      ? context.replace(/[^\w\s.,!?'"-]/g, '').slice(0, 200)
      : '';

    const systemPrompt = `You are a helpful product advisor for Kerala Ayurveda, a traditional Ayurvedic wellness company founded in 1945. Write a 2–3 sentence personalised note explaining why the Ashwagandha Capsules pack and routine suit this customer's stated goal.

Rules you MUST follow:
- Do NOT make disease-treatment claims (no "cures", "treats", "heals").
- Do NOT promise guaranteed outcomes or specific timeframes.
- Do NOT cite clinical studies or certifications unless they are well-established public facts.
- Frame everything as traditional Ayurvedic use or general wellness support.
- Keep the tone warm, informative, and professional.
- End with a brief reminder to consult a healthcare professional if needed.
- Maximum 60 words.`;

    const userPrompt = `Customer goal: ${goalLabel}
Preferred frequency: ${freqLabel}
Recommended pack: ${pack.title} (${pack.supply})
Routine: ${routineText}
${safeContext ? `Customer note: "${safeContext}"` : ''}

Write the personalised 2–3 sentence note.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 120,
        temperature: 0.6,
      });

      const blurb = completion.choices[0]?.message?.content?.trim();
      if (!blurb) throw new Error('Empty response from OpenAI');

      return { blurb, blurbSource: 'ai' };
    } catch (err) {
      this.logger.error('OpenAI blurb generation failed — using fallback', err);
      return { blurb: BLURB_FALLBACKS[goal], blurbSource: 'fallback' };
    }
  }
}
