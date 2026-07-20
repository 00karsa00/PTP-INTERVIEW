import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RecommendationService } from './recommendation.service';
import { Goal, Frequency } from './dto/recommend-request.dto';
import {
  PACKS,
  ROUTINES,
  DISCLAIMER,
  GOAL_LABELS,
  FREQUENCY_LABELS,
} from './data/routine-templates';

/**
 * Unit tests for the core recommendation logic.
 * No OpenAI calls are made — the service is constructed without an API key
 * so the AI path is bypassed and the fallback is tested separately.
 */
describe('RecommendationService — buildRecommendation (pure logic)', () => {
  let service: RecommendationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        {
          provide: ConfigService,
          useValue: {
            // No API key → service initialises without OpenAI client
            get: (key: string) => (key === 'openai.apiKey' ? '' : undefined),
          },
        },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
  });

  // ── Pack selection ─────────────────────────────────────────────────────────

  it('returns the 60-cap Standard pack for once_daily frequency', () => {
    const result = service.buildRecommendation(
      Goal.STRESS_CALM,
      Frequency.ONCE_DAILY,
    );
    expect(result.pack).toEqual(PACKS[Frequency.ONCE_DAILY]);
    expect(result.pack.capsules).toBe(60);
  });

  it('returns the 90-cap Value pack for twice_daily frequency', () => {
    const result = service.buildRecommendation(
      Goal.ENERGY_FOCUS,
      Frequency.TWICE_DAILY,
    );
    expect(result.pack).toEqual(PACKS[Frequency.TWICE_DAILY]);
    expect(result.pack.capsules).toBe(90);
  });

  // ── Routine shape ──────────────────────────────────────────────────────────

  it('returns a single evening step for stress_calm + once_daily', () => {
    const result = service.buildRecommendation(
      Goal.STRESS_CALM,
      Frequency.ONCE_DAILY,
    );
    expect(result.routine).toHaveLength(1);
    expect(result.routine[0].time).toBe('evening');
  });

  it('returns two steps for stress_calm + twice_daily', () => {
    const result = service.buildRecommendation(
      Goal.STRESS_CALM,
      Frequency.TWICE_DAILY,
    );
    expect(result.routine).toHaveLength(2);
  });

  it('returns a morning step for energy_focus + once_daily', () => {
    const result = service.buildRecommendation(
      Goal.ENERGY_FOCUS,
      Frequency.ONCE_DAILY,
    );
    expect(result.routine[0].time).toBe('morning');
  });

  it('returns a before_bed step for sleep_quality + once_daily', () => {
    const result = service.buildRecommendation(
      Goal.SLEEP_QUALITY,
      Frequency.ONCE_DAILY,
    );
    expect(result.routine[0].time).toBe('before_bed');
  });

  // ── Labels ─────────────────────────────────────────────────────────────────

  it('maps goal enum to human-readable label', () => {
    const result = service.buildRecommendation(
      Goal.ENERGY_FOCUS,
      Frequency.ONCE_DAILY,
    );
    expect(result.goal).toBe(GOAL_LABELS[Goal.ENERGY_FOCUS]);
  });

  it('maps frequency enum to human-readable label', () => {
    const result = service.buildRecommendation(
      Goal.STRESS_CALM,
      Frequency.TWICE_DAILY,
    );
    expect(result.frequency).toBe(FREQUENCY_LABELS[Frequency.TWICE_DAILY]);
  });

  // ── Disclaimer always present ──────────────────────────────────────────────

  it('always includes the FDA disclaimer', () => {
    const result = service.buildRecommendation(
      Goal.SLEEP_QUALITY,
      Frequency.TWICE_DAILY,
    );
    expect(result.disclaimer).toBe(DISCLAIMER);
    expect(result.disclaimer).toContain(
      'not been evaluated by the Food and Drug Administration',
    );
  });

  // ── All goal × frequency combinations are covered ─────────────────────────

  const goals = Object.values(Goal);
  const freqs = Object.values(Frequency);

  goals.forEach((goal) => {
    freqs.forEach((freq) => {
      it(`produces a valid result for goal=${goal}, frequency=${freq}`, () => {
        const result = service.buildRecommendation(goal, freq);
        expect(result.pack).toBeDefined();
        expect(result.routine.length).toBeGreaterThan(0);
        expect(result.disclaimer).toBeTruthy();
        expect(result.goal).toBeTruthy();
        expect(result.frequency).toBeTruthy();
      });
    });
  });

  // ── getRecommendation — fallback blurb when no API key ────────────────────

  it('resolves with blurbSource=fallback when OpenAI key is absent', async () => {
    const result = await service.getRecommendation({
      goal: Goal.STRESS_CALM,
      frequency: Frequency.ONCE_DAILY,
    });
    expect(result.blurbSource).toBe('fallback');
    expect(result.blurb.length).toBeGreaterThan(20);
  });

  it('does not expose any treatment claims in fallback blurb', async () => {
    for (const goal of goals) {
      const result = await service.getRecommendation({
        goal,
        frequency: Frequency.ONCE_DAILY,
      });
      const lowerBlurb = result.blurb.toLowerCase();
      expect(lowerBlurb).not.toMatch(/\bcures?\b/);
      expect(lowerBlurb).not.toMatch(/\btreats?\b/);
      expect(lowerBlurb).not.toMatch(/\bheals?\b/);
      expect(lowerBlurb).not.toMatch(/\bguaranteed\b/);
    }
  });
});
