export default function Prose({ title, children }) {
  return <div className="mx-auto max-w-3xl px-4 py-10"><h1 className="text-2xl font-bold sm:text-3xl">{title}</h1><div className="mt-6 space-y-4 leading-relaxed text-gray-700">{children}</div></div>;
}
