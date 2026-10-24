"use client";
import { forwardRef, useEffect, useRef } from "react";
// Auto-growing textarea with live character counter. Pass `length` (e.g. from RHF watch) for the counter.
const Textarea = forwardRef(function Textarea({ max = 500, length = 0, className = "", onInput, ...p }, ref) {
  const el = useRef(null);
  const fit = () => { const t = el.current; if (!t) return; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 240) + "px"; };
  useEffect(fit, [length]);
  const near = length > max * 0.9;
  return (
    <div className="relative">
      <textarea
        {...p} maxLength={max} rows={3}
        ref={(n) => { el.current = n; typeof ref === "function" ? ref(n) : ref && (ref.current = n); }}
        onInput={(e) => { fit(); onInput?.(e); }}
        className={`w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 pb-7 text-sm leading-relaxed outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-red-100 ${className}`}
      />
      <span className={`pointer-events-none absolute bottom-2 right-3 text-xs ${near ? "text-brand-600" : "text-gray-400"}`}>{length.toLocaleString("bn-BD")}/{max.toLocaleString("bn-BD")}</span>
    </div>
  );
});
export default Textarea;
