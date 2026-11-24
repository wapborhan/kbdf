"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function Progress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const tricklerRef = useRef(null);

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tricklerRef.current) clearInterval(tricklerRef.current);

    setVisible(true);
    setProgress(25);

    tricklerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(tricklerRef.current);
          return 90;
        }
        const diff = (90 - prev) * 0.15;
        return prev + Math.max(diff, 1.5);
      });
    }, 180);

    timerRef.current = setTimeout(() => {
      complete();
    }, 7000);
  };

  const complete = () => {
    if (tricklerRef.current) clearInterval(tricklerRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  };

  // Trigger completion whenever route or search parameters change
  useEffect(() => {
    complete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
        return;
      }

      const target = e.target;
      const anchor = target.closest ? target.closest("a") : null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("javascript:") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      try {
        const destUrl = new URL(anchor.href, window.location.href);
        const currentUrl = new URL(window.location.href);

        if (destUrl.origin !== currentUrl.origin) return;
        if (destUrl.pathname === currentUrl.pathname && destUrl.search === currentUrl.search) {
          return;
        }

        start();
      } catch {
        // ignore invalid URL
      }
    };

    const handlePopState = () => {
      start();
    };

    const handleCustomStart = () => start();
    const handleCustomDone = () => complete();

    document.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("loading:start", handleCustomStart);
    window.addEventListener("loading:done", handleCustomDone);

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("loading:start", handleCustomStart);
      window.removeEventListener("loading:done", handleCustomDone);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tricklerRef.current) clearInterval(tricklerRef.current);
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 right-0 top-0 z-[99999] h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8),0_0_4px_rgba(244,63,94,0.6)] transition-all ease-out"
        style={{
          width: `${progress}%`,
          transitionDuration: progress === 100 ? "200ms" : "300ms",
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <Progress />
    </Suspense>
  );
}
