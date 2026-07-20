import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, FlaskConical } from 'lucide-react';
import { INGREDIENTS, DISCLAIMER } from '../../data/product';

export function IngredientsPanel() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-stone-200 pt-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ingredients-content"
        className="flex w-full items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-ka-bark">
          <FlaskConical size={15} className="text-ka-green-600" aria-hidden="true" />
          Ingredients & formulation
        </span>
        <ChevronDown
          size={16}
          className={clsx(
            'text-stone-400 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id="ingredients-content"
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0',
        )}
      >
        <table className="w-full text-sm" aria-label="Supplement facts">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="pb-2 text-left font-semibold text-ka-bark/70">Ingredient</th>
              <th className="pb-2 text-left font-semibold text-ka-bark/70">Amount</th>
              <th className="pb-2 text-left font-semibold text-ka-bark/70">Role</th>
            </tr>
          </thead>
          <tbody>
            {INGREDIENTS.map((ing) => (
              <tr key={ing.name} className="border-b border-stone-100">
                <td className="py-2.5 font-medium text-ka-bark">{ing.name}</td>
                <td className="py-2.5 text-ka-green-700">{ing.amount}</td>
                <td className="py-2.5 text-ka-bark/60">{ing.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-4 rounded-lg bg-stone-100 px-3 py-2.5 text-xs leading-relaxed text-stone-500">
          {DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
