"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => document.documentElement.classList.contains("dark");
    setIsDark(checkDark());

    const onThemeChange = () => setIsDark(checkDark());
    window.addEventListener("theme-change", onThemeChange);
    return () => window.removeEventListener("theme-change", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("kbdf_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("kbdf_theme", "light");
    }
    setIsDark(nextDark);
    window.dispatchEvent(new Event("theme-change"));
  };

  // Render a placeholder button during SSR to preserve layout without mismatch
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="থিম পরিবর্তন"
        className={`flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/80 p-2 text-gray-500 shadow-sm transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 ${className}`}
      >
        <Moon className="h-4 w-4 opacity-50" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "লাইট থিমে স্যুইচ করুন" : "ডার্ক থিমে স্যুইচ করুন"}
      title={isDark ? "লাইট থিমে স্যুইচ করুন" : "ডার্ক থিমে স্যুইচ করুন"}
      className={`group relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white/80 p-2 text-gray-600 shadow-sm transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-amber-300 ${className}`}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 group-hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200 group-hover:-rotate-12" />
      )}
    </button>
  );
}
