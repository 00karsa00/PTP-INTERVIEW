"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RecommendationService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const routine_templates_1 = require("./data/routine-templates");
let RecommendationService = RecommendationService_1 = class RecommendationService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(RecommendationService_1.name);
        this.openai = null;
        const apiKey = this.config.get('openai.apiKey');
        if (apiKey) {
            this.openai = new openai_1.default({ apiKey });
        }
        else {
            this.logger.warn('OPENAI_API_KEY not set — AI blurbs will use static fallbacks.');
        }
    }
    buildRecommendation(goal, frequency) {
        return {
            goal: routine_templates_1.GOAL_LABELS[goal],
            frequency: routine_templates_1.FREQUENCY_LABELS[frequency],
            pack: routine_templates_1.PACKS[frequency],
            routine: routine_templates_1.ROUTINES[goal][frequency],
            disclaimer: routine_templates_1.DISCLAIMER,
        };
    }
    async getRecommendation(dto) {
        const base = this.buildRecommendation(dto.goal, dto.frequency);
        const { blurb, blurbSource } = await this.generateBlurb(dto.goal, dto.frequency, dto.context);
        return { ...base, blurb, blurbSource };
    }
    async generateBlurb(goal, frequency, context) {
        if (!this.openai) {
            return { blurb: routine_templates_1.BLURB_FALLBACKS[goal], blurbSource: 'fallback' };
        }
        const goalLabel = routine_templates_1.GOAL_LABELS[goal];
        const freqLabel = routine_templates_1.FREQUENCY_LABELS[frequency];
        const pack = routine_templates_1.PACKS[frequency];
        const routine = routine_templates_1.ROUTINES[goal][frequency];
        const routineText = routine
            .map((r) => `${r.label}: ${r.instruction}`)
            .join(' ');
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
            if (!blurb)
                throw new Error('Empty response from OpenAI');
            return { blurb, blurbSource: 'ai' };
        }
        catch (err) {
            this.logger.error('OpenAI blurb generation failed — using fallback', err);
            return { blurb: routine_templates_1.BLURB_FALLBACKS[goal], blurbSource: 'fallback' };
        }
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = RecommendationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map