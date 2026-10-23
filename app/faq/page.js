import Prose from "@/components/Prose";
export const metadata = { title: "সাধারণ প্রশ্ন | KBDF" };
const faqs = [
  ["রক্ত চাইতে কি টাকা লাগে?", "না, এই প্ল্যাটফর্মে দাতা খুঁজতে বা আবেদন করতে কোনো ফি নেই।"],
  ["নিবন্ধনের পর কখন তালিকায় আসব?", "অ্যাডমিন যাচাই ও অনুমোদন করলে আপনি দাতা তালিকায় আসবেন।"],
  ["আমার ফোন নম্বর কি সবাই দেখবে?", "অনুমোদনের পর WhatsApp যোগাযোগের জন্য আপনার নম্বর দাতা কার্ডে ব্যবহৃত হয়। নিবন্ধনের সময় আপনি এতে সম্মতি দেন।"],
  ["আবেদন কীভাবে প্রকাশ হয়?", "জমা দেওয়া আবেদন অ্যাডমিন যাচাই করে অনুমোদন করলে তালিকায় দেখা যায়।"],
];
export default function FAQ() {
  return <Prose title="সাধারণ প্রশ্ন">{faqs.map(([q, a]) => <details key={q} className="rounded-xl bg-white p-4 ring-1 ring-gray-200"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2">{a}</p></details>)}</Prose>;
}
