import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  Wind,
  Zap,
  Moon,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Sun,
  Repeat2,
  Sparkles,
  AlertTriangle,
  Clock,
  Package,
} from 'lucide-react';
import { useRecommendation } from '../../hooks/useRecommendation';
import { Skeleton } from '../ui/Skeleton';
import type { Goal, Frequency, RecommendResponse } from '../../types/recommendation';
import type { Variant } from '../../data/product';
import { VARIANTS } from '../../data/product';

// ── Quiz options ───────────────────────────────────────────────────────────────

const GOAL_OPTIONS: Array<{ value: Goal; label: string; sub: string; icon: React.ReactNode }> = [
  {
    value: 'stress_calm',
    label: 'Stress & calm',
    sub: 'Support for the body\'s response to everyday pressure',
    icon: <Wind size={22} />,
  },
  {
    value: 'energy_focus',
    label: 'Energy & focus',
    sub: 'Sustained energy and mental clarity throughout the day',
    icon: <Zap size={22} />,
  },
  {
    value: 'sleep_quality',
    label: 'Sleep quality',
    sub: 'Promoting a sense of calm before rest',
    icon: <Moon size={22} />,
  },
];

const FREQ_OPTIONS: Array<{ value: Frequency; label: string; sub: string; icon: React.ReactNode }> = [
  {
    value: 'once_daily',
    label: 'Once daily',
    sub: 'A simple, easy habit to build into your routine',
    icon: <Sun size={22} />,
  },
  {
    value: 'twice_daily',
    label: 'Twice daily',
    sub: 'Morning and evening — as directed on the label',
    icon: <Repeat2 size={22} />,
  },
];

// ── Helper: map pack title from API response to a Variant id ──────────────────

function findVariantByPackTitle(packTitle: string): Variant | undefined {
  // Loose match: "Standard — 60 Capsules" → variant with capsules=60
  const capMatch = packTitle.match(/(\d+)\s*[Cc]apsule/);
  if (!capMatch) return undefined;
  const caps = parseInt(capMatch[1], 10);
  return VARIANTS.find((v) => v.capsules === caps);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

interface OptionButtonProps<T> {
  option: { value: T; label: string; sub: string; icon: React.ReactNode };
  selected: T | null;
  onSelect: (v: T) => void;
}

function OptionButton<T extends string>({
  option,
  selected,
  onSelect,
}: OptionButtonProps<T>) {
  const isSelected = selected === option.value;
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={isSelected}
      className={clsx(
        'flex w-full items-center gap-4 rounded-xl border-2 px-4 py-3.5 text-left',
        'transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2',
        isSelected
          ? 'border-ka-green-500 bg-ka-green-50 shadow-sm'
          : 'border-stone-200 bg-white hover:border-ka-green-200 hover:bg-stone-50',
      )}
    >
      <span
        className={clsx(
          'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
          isSelected
            ? 'bg-ka-green-500 text-white'
            : 'bg-stone-100 text-stone-400',
        )}
        aria-hidden="true"
      >
        {option.icon}
      </span>
      <div>
        <p
          className={clsx(
            'text-sm font-semibold transition-colors duration-150',
            isSelected ? 'text-ka-green-700' : 'text-ka-bark',
          )}
        >
          {option.label}
        </p>
        <p className="mt-0.5 text-xs text-ka-bark/55">{option.sub}</p>
      </div>
    </button>
  );
}

// ── Recommendation result card ─────────────────────────────────────────────────

interface ResultCardProps {
  data: RecommendResponse;
  onReset: () => void;
  onApply: (variant: Variant) => void;
}

function ResultCard({ data, onReset, onApply }: ResultCardProps) {
  const matchedVariant = findVariantByPackTitle(data.pack.title);

  return (
    <div className="space-y-5 animate-scale-in">
      {/* Blurb */}
      <div className="flex gap-3 rounded-xl border border-ka-green-200 bg-ka-green-50 p-4">
        <Sparkles
          size={18}
          className="mt-0.5 flex-shrink-0 text-ka-green-500"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm leading-relaxed text-ka-green-900">{data.blurb}</p>
          {data.blurbSource === 'fallback' && (
            <p className="mt-1 text-[10px] text-ka-green-600/70 italic">
              General guidance — not AI-personalised
            </p>
          )}
        </div>
      </div>

      {/* Pack */}
      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ka-bark/50">
          <Package size={12} aria-hidden="true" />
          Recommended pack
        </p>
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <p className="font-semibold text-ka-bark">{data.pack.title}</p>
          <p className="mt-0.5 text-sm text-stone-500">{data.pack.supply}</p>
          <p className="mt-2 text-sm leading-relaxed text-ka-bark/70">
            {data.pack.rationale}
          </p>
          {matchedVariant && (
            <button
              type="button"
              onClick={() => onApply(matchedVariant)}
              className="mt-3 w-full rounded-lg bg-ka-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ka-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ka-green-500 focus-visible:ring-offset-2"
            >
              Select this pack
            </button>
          )}
        </div>
      </div>

      {/* Routine */}
      <div className="space-y-1.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ka-bark/50">
          <Clock size={12} aria-hidden="true" />
          Your routine
        </p>
        <ul className="space-y-2">
          {data.routine.map((step) => (
            <li
              key={step.time}
              className="flex items-start gap-3 rounded-xl border border-stone-100 bg-white px-4 py-3"
            >
              <span
                className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-ka-gold-100 text-ka-gold-600"
                aria-hidden="true"
              >
                {step.time === 'morning' && <Sun size={12} />}
                {step.time === 'evening' && <Moon size={12} />}
                {step.time === 'before_bed' && <Moon size={12} />}
              </span>
              <div>
                <p className="text-xs font-semibold text-ka-bark/60">{step.label}</p>
                <p className="mt-0.5 text-sm text-ka-bark/80">{step.instruction}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] leading-relaxed text-stone-400">{data.disclaimer}</p>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 text-xs text-stone-400 transition-colors hover:text-ka-green-600"
      >
        <RotateCcw size={12} aria-hidden="true" />
        Start over
      </button>
    </div>
  );
}

// ── Main quiz component ────────────────────────────────────────────────────────

interface RoutineQuizProps {
  /** Called when the user clicks "Select this pack" in the result card */
  onVariantRecommend: (variant: Variant) => void;
}

export function RoutineQuiz({ onVariantRecommend }: RoutineQuizProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [goal, setGoal] = useState<Goal | null>(null);
  const [frequency, setFrequency] = useState<Frequency | null>(null);
  const [context, setContext] = useState('');

  const { status, data, error, fetch, reset } = useRecommendation();

  function handleGoalSelect(g: Goal) {
    setGoal(g);
    setDirection('forward');
    setTimeout(() => setStep(1), 220);
  }

  function handleFreqSelect(f: Frequency) {
    setFrequency(f);
  }

  function handleSubmit() {
    if (!goal || !frequency) return;
    setDirection('forward');
    setStep(2);
    fetch(goal, frequency, context.trim() || undefined);
  }

  function handleReset() {
    setDirection('back');
    setStep(0);
    setGoal(null);
    setFrequency(null);
    setContext('');
    reset();
  }

  return (
    <section
      className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
      aria-labelledby="quiz-heading"
    >
      <div className="mb-5">
        <h2
          id="quiz-heading"
          className="font-serif text-lg font-semibold text-ka-bark"
        >
          Is this right for me?
        </h2>
        <p className="mt-1 text-sm text-ka-bark/60">
          Answer two quick questions to get a personalised routine.
        </p>
      </div>

      {/* Progress dots */}
      <div className="mb-5 flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((s) => (
          <div
            key={s}
            className={clsx(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              s <= step ? 'bg-ka-green-500' : 'bg-stone-200',
            )}
          />
        ))}
      </div>

      {/* Step 0 — Goal */}
      {step === 0 && (
        <div
          key="step-0"
          className={clsx(
            'space-y-3',
            direction === 'forward' ? 'animate-fade-up' : 'animate-slide-in-right',
          )}
          role="group"
          aria-labelledby="step0-label"
        >
          <p id="step0-label" className="text-sm font-semibold text-ka-bark">
            What are you looking for?
          </p>
          {GOAL_OPTIONS.map((opt) => (
            <OptionButton key={opt.value} option={opt} selected={goal} onSelect={handleGoalSelect} />
          ))}
        </div>
      )}

      {/* Step 1 — Frequency */}
      {step === 1 && (
        <div
          key="step-1"
          className={clsx(
            'space-y-3',
            direction === 'forward' ? 'animate-slide-in-right' : 'animate-fade-up',
          )}
          role="group"
          aria-labelledby="step1-label"
        >          <p id="step1-label" className="text-sm font-semibold text-ka-bark">
            How often do you plan to take it?
          </p>
          {FREQ_OPTIONS.map((opt) => (
            <OptionButton key={opt.value} option={opt} selected={frequency} onSelect={handleFreqSelect} />
          ))}

          {/* Optional context input */}
          <div className="pt-1">
            <label
              htmlFor="quiz-context"
              className="mb-1.5 block text-xs font-medium text-ka-bark/60"
            >
              Anything else on your mind? <span className="font-normal italic">(optional)</span>
            </label>
            <textarea
              id="quiz-context"
              value={context}
              onChange={(e) => setContext(e.target.value.slice(0, 200))}
              placeholder="e.g. I travel frequently, or I prefer mornings…"
              rows={2}
              maxLength={200}
              className="w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-ka-bark placeholder:text-stone-300 focus:border-ka-green-400 focus:outline-none focus:ring-1 focus:ring-ka-green-300"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setDirection('back'); setStep(0); }}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-stone-400 hover:text-ka-bark transition-colors"
              aria-label="Go back to previous question"
            >
              <ChevronLeft size={15} aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!frequency}
              className={clsx(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white',
                'transition-all duration-150',
                frequency
                  ? 'bg-ka-green-600 hover:bg-ka-green-700'
                  : 'cursor-not-allowed bg-stone-300',
              )}
            >
              Get my routine
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Result */}
      {step === 2 && (
        <div className="animate-fade-up">
          {status === 'loading' && (
            <div className="space-y-4" role="status" aria-live="polite" aria-label="Loading your recommendation">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton lines={3} />
              <Skeleton lines={2} />
            </div>
          )}

          {status === 'error' && (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              role="alert"
            >
              <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-red-500" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Couldn't load your recommendation
                </p>
                <p className="mt-0.5 text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => goal && frequency && fetch(goal, frequency, context || undefined)}
                  className="mt-2 text-xs font-medium text-red-600 underline hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {status === 'success' && data && (
            <ResultCard
              data={data}
              onReset={handleReset}
              onApply={onVariantRecommend}
            />
          )}
        </div>
      )}
    </section>
  );
}
