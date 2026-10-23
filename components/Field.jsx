export const inputCls = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-red-100";
export default function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{typeof error === "string" ? error : error.message}</span>}
    </label>
  );
}
