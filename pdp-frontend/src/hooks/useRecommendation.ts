import { useState, useCallback } from 'react';
import { fetchRecommendation } from '../api/recommendation';
import type {
  Goal,
  Frequency,
  RecommendResponse,
} from '../types/recommendation';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseRecommendationReturn {
  status: Status;
  data: RecommendResponse | null;
  error: string | null;
  fetch: (goal: Goal, frequency: Frequency, context?: string) => void;
  reset: () => void;
}

export function useRecommendation(): UseRecommendationReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (goal: Goal, frequency: Frequency, context?: string) => {
      setStatus('loading');
      setError(null);

      try {
        const result = await fetchRecommendation({ goal, frequency, context });
        setData(result);
        setStatus('success');
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.';
        setError(msg);
        setStatus('error');
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, fetch, reset };
}
