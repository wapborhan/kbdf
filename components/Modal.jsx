"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
export default function Modal({ title, onClose, children }) {
  useEffect(() => { const k = (e) => e.key === "Escape" && onClose(); document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">{title}</h2><button onClick={onClose} aria-label="বন্ধ" className="rounded-full p-1.5 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </div>
  );
}
