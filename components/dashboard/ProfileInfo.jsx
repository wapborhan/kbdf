import { GENDERS, MARITAL, PROFESSIONS } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { Card } from "./ui";
const L = (arr, v) => (arr.find((x) => x[0] === v) || [, v])[1];

export function infoSections(d) {
  const rows = (a) => a.filter(([, v]) => v);
  return [
    ["ব্যক্তিগত তথ্য", rows([["পূর্ণ নাম", d.fullName], ["লিঙ্গ", L(GENDERS, d.gender)], ["পিতার নাম", d.fatherName], ["মাতার নাম", d.motherName], ["জন্মতারিখ", d.birthDate && fmtDate(d.birthDate)], ["ধর্ম", d.religion], ["বৈবাহিক অবস্থা", L(MARITAL, d.maritalStatus)]])],
    ["যোগাযোগ", rows([["WhatsApp", d.whatsapp], ["ঠিকানা", d.address]])],
    ["পেশা", rows([["বর্তমান পেশা", L(PROFESSIONS, d.profession)], ["শ্রেণি/বর্ষ", d.className], ["প্রতিষ্ঠান", d.institutionName], ["প্রতিষ্ঠানের ঠিকানা", d.institutionAddress], ["কোম্পানি", d.companyName], ["পদবী", d.position], ["কোম্পানির ঠিকানা", d.companyAddress], ["বিবরণ", d.professionDetails]])],
    ["গোপনীয়তা", rows([["স্বেচ্ছাসেবক তালিকায় নাম ও ছবি প্রকাশ", d.publicConsent ? "সম্মতি আছে" : "সম্মতি নেই"]])],
  ];
}
export default function ProfileInfo({ d }) {
  if (!d?.fullName) return <p className="py-6 text-center text-gray-500 dark:text-slate-400">এখনো কোনো তথ্য দেওয়া হয়নি।</p>;
  return (
    <div className="space-y-4">
      {infoSections(d).map(([t, rows]) => rows.length > 0 && (
        <Card key={t} className="p-5">
          <h3 className="mb-3 font-bold">{t}</h3>
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">{rows.map(([k, v]) => <div key={k}><dt className="text-xs text-gray-500 dark:text-slate-400">{k}</dt><dd className="text-sm font-medium text-gray-900 dark:text-slate-100">{v}</dd></div>)}</dl>
        </Card>
      ))}
    </div>
  );
}
