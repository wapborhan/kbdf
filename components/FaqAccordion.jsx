"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-4">
      {items.map(([q, a], idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={q}
            className={`rounded-2xl bg-white shadow-sm ring-1 transition-all duration-200 dark:bg-slate-800/90 ${
              isOpen
                ? "shadow-md ring-brand-500/50 dark:ring-brand-500/50"
                : "ring-gray-200 hover:ring-gray-300 dark:ring-slate-700/80 dark:hover:ring-slate-600"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left select-none"
              aria-expanded={isOpen}
            >
              <span
                className={`font-semibold transition-colors ${
                  isOpen
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-gray-900 dark:text-slate-100"
                }`}
              >
                {q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180 bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400"
                    : "bg-gray-100 text-gray-500 dark:bg-slate-700/60 dark:text-slate-400"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-gray-100 px-5 pb-5 pt-3 dark:border-slate-700/60">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-slate-300">
                  {a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
