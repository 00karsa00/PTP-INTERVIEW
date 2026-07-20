"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCLAIMER = exports.FREQUENCY_LABELS = exports.GOAL_LABELS = exports.BLURB_FALLBACKS = exports.ROUTINES = exports.PACKS = void 0;
const recommend_request_dto_1 = require("../dto/recommend-request.dto");
exports.PACKS = {
    [recommend_request_dto_1.Frequency.ONCE_DAILY]: {
        title: 'Standard — 60 Capsules',
        capsules: 60,
        supply: '2-month supply at once daily',
        rationale: 'At one capsule per day you have a full two months to assess how your body responds — the typical window referenced in traditional Ayurvedic practice.',
    },
    [recommend_request_dto_1.Frequency.TWICE_DAILY]: {
        title: 'Value — 90 Capsules',
        capsules: 90,
        supply: '~6-week supply at twice daily',
        rationale: 'Twice-daily use (as directed on the label: 1 capsule twice daily) means you get through a 60-cap bottle in a month; the 90-cap pack gives you a little breathing room without reordering.',
    },
};
exports.ROUTINES = {
    [recommend_request_dto_1.Goal.STRESS_CALM]: {
        [recommend_request_dto_1.Frequency.ONCE_DAILY]: [
            {
                time: 'evening',
                label: 'Evening — Stress wind-down',
                instruction: 'Take 1 capsule with a small glass of warm water or warm milk about an hour before you wind down for the evening.',
            },
        ],
        [recommend_request_dto_1.Frequency.TWICE_DAILY]: [
            {
                time: 'morning',
                label: 'Morning — Daily foundation',
                instruction: 'Take 1 capsule with water after breakfast.',
            },
            {
                time: 'evening',
                label: 'Evening — Stress wind-down',
                instruction: 'Take 1 capsule with warm water or milk as part of your evening routine.',
            },
        ],
    },
    [recommend_request_dto_1.Goal.ENERGY_FOCUS]: {
        [recommend_request_dto_1.Frequency.ONCE_DAILY]: [
            {
                time: 'morning',
                label: 'Morning — Energy start',
                instruction: 'Take 1 capsule with a full glass of water alongside breakfast to support steady energy through the day.',
            },
        ],
        [recommend_request_dto_1.Frequency.TWICE_DAILY]: [
            {
                time: 'morning',
                label: 'Morning — Primary dose',
                instruction: 'Take 1 capsule with water after breakfast — your main energy-supporting dose.',
            },
            {
                time: 'evening',
                label: 'Afternoon / early evening — Second dose',
                instruction: 'Take 1 capsule with water in the late afternoon if energy dips. Avoid too close to bedtime.',
            },
        ],
    },
    [recommend_request_dto_1.Goal.SLEEP_QUALITY]: {
        [recommend_request_dto_1.Frequency.ONCE_DAILY]: [
            {
                time: 'before_bed',
                label: 'Pre-sleep — 30–60 min before bed',
                instruction: 'Take 1 capsule 30–60 minutes before bed with warm milk or water. (Illustrative timing — not from the product label.)',
            },
        ],
        [recommend_request_dto_1.Frequency.TWICE_DAILY]: [
            {
                time: 'morning',
                label: 'Morning — Baseline dose',
                instruction: 'Take 1 capsule with breakfast to maintain daily consistency.',
            },
            {
                time: 'before_bed',
                label: 'Pre-sleep — Main sleep-support dose',
                instruction: 'Take 1 capsule 30–60 minutes before bed with warm milk. (Illustrative timing.)',
            },
        ],
    },
};
exports.BLURB_FALLBACKS = {
    [recommend_request_dto_1.Goal.STRESS_CALM]: 'Ashwagandha is traditionally used as an adaptogen to support the body\'s natural response to everyday stress. Based on your goal, an evening routine is a common starting approach — adjust as needed and check with a healthcare professional before starting any new supplement.',
    [recommend_request_dto_1.Goal.ENERGY_FOCUS]: 'Ashwagandha is traditionally associated with supporting sustained energy and mental focus. A morning routine is a common starting point for this goal — adjust as needed and consult a healthcare professional if you have any questions.',
    [recommend_request_dto_1.Goal.SLEEP_QUALITY]: 'Ashwagandha has traditionally been used in Ayurvedic practice in the context of restful sleep. An evening or pre-sleep routine is a common starting approach — adjust as needed and consult a healthcare professional before starting any new supplement.',
};
exports.GOAL_LABELS = {
    [recommend_request_dto_1.Goal.STRESS_CALM]: 'Stress & calm',
    [recommend_request_dto_1.Goal.ENERGY_FOCUS]: 'Energy & focus',
    [recommend_request_dto_1.Goal.SLEEP_QUALITY]: 'Sleep quality',
};
exports.FREQUENCY_LABELS = {
    [recommend_request_dto_1.Frequency.ONCE_DAILY]: 'Once daily',
    [recommend_request_dto_1.Frequency.TWICE_DAILY]: 'Twice daily',
};
exports.DISCLAIMER = 'These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a qualified healthcare professional before use, especially if you are pregnant, nursing, taking any medication, or have a medical condition.';
//# sourceMappingURL=routine-templates.js.map