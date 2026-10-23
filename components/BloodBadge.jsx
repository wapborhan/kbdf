export default function BloodBadge({ group, size = "md" }) {
  const s = size === "lg" ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm";
  return <span className={`${s} inline-flex shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white shadow-inner`} style={{ borderRadius: "50% 50% 50% 8%" , transform: "rotate(-45deg)" }}><span style={{ transform: "rotate(45deg)" }}>{group}</span></span>;
}
