"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
import DatePicker from "@/components/DatePicker";
import Textarea from "@/components/Textarea";
import { GENDERS, MARITAL, PROFESSIONS, RELIGIONS } from "@/lib/constants";
import { todayISO } from "@/lib/utils";

function Choice({ label, error, options, value, onChange }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => <button type="button" key={v} onClick={() => onChange(v)} className={`rounded-full px-4 py-2 text-sm transition ${value === v ? "bg-brand-600 font-medium text-white shadow" : "bg-white ring-1 ring-gray-300 hover:ring-brand-600"}`}>{l}</button>)}
      </div>
      {error && <span className="mt-1 block text-xs text-red-600">{error.message}</span>}
    </div>
  );
}

// onSubmit(data) -> Promise<boolean>
export default function ProfileForm({ onSubmit, defaultValues = {}, submitLabel = "সংরক্ষণ করুন" }) {
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(profileSchema), defaultValues: { gender: "", maritalStatus: "", profession: "", religion: "", ...defaultValues } });
  const prof = watch("profession");
  const inp = (n, label, x = {}) => <Field label={label} error={errors[n]}><input className={inputCls} {...x} {...register(n)} /></Field>;
  const choice = (n, label, options) => <Controller name={n} control={control} render={({ field }) => <Choice label={label} error={errors[n]} options={options} value={field.value} onChange={field.onChange} />} />;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">{inp("fullName", "পূর্ণ নাম *")}</div>
      {inp("fatherName", "পিতার নাম *")}{inp("motherName", "মাতার নাম *")}
      {choice("gender", "লিঙ্গ *", GENDERS)}
      <Field label="জন্মতারিখ *" error={errors.birthDate}><Controller name="birthDate" control={control} render={({ field }) => <DatePicker value={field.value || ""} onChange={field.onChange} max={todayISO()} placeholder="জন্মতারিখ নির্বাচন করুন" />} /></Field>
      {inp("whatsapp", "WhatsApp নম্বর *", { inputMode: "tel", placeholder: "01XXXXXXXXX" })}
      <Field label="ধর্ম *" error={errors.religion}><select className={inputCls} {...register("religion")}><option value="">নির্বাচন করুন</option>{RELIGIONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
      {choice("maritalStatus", "বৈবাহিক অবস্থা *", MARITAL)}
      <div className="sm:col-span-2"><Field label="ঠিকানা *" error={errors.address}><Textarea max={200} length={(watch("address") || "").length} placeholder="গ্রাম/মহল্লা, থানা, জেলা..." {...register("address")} /></Field></div>

      <div className="space-y-4 rounded-2xl bg-gray-50 p-4 sm:col-span-2">
        {choice("profession", "বর্তমান পেশা *", PROFESSIONS)}
        {prof === "student" && <div className="grid gap-4 sm:grid-cols-2">{inp("className", "শ্রেণি / বর্ষ *")}{inp("institutionName", "স্কুল / কলেজ / বিশ্ববিদ্যালয়ের নাম *")}<div className="sm:col-span-2">{inp("institutionAddress", "প্রতিষ্ঠানের ঠিকানা *")}</div></div>}
        {prof === "job_holder" && <div className="grid gap-4 sm:grid-cols-2">{inp("companyName", "প্রতিষ্ঠানের নাম *")}{inp("position", "পদবী *")}<div className="sm:col-span-2">{inp("companyAddress", "প্রতিষ্ঠানের ঠিকানা *")}</div></div>}
        {prof === "other" && <Field label="পেশার বিবরণ *" error={errors.professionDetails}><Textarea max={300} length={(watch("professionDetails") || "").length} placeholder="যেমন: ব্যবসা, গৃহিণী, কৃষি..." {...register("professionDetails")} /></Field>}
      </div>
      <label className="flex items-start gap-2 rounded-xl bg-teal-50 p-3 text-sm text-teal-800 sm:col-span-2"><input type="checkbox" className="mt-1" {...register("publicConsent")} /><span>(ঐচ্ছিক) স্বেচ্ছাসেবক হলে আমার নাম ও প্রোফাইল ছবি ওয়েবসাইটের স্বেচ্ছাসেবক তালিকায় প্রকাশ করা যাবে।</span></label>
      <button disabled={isSubmitting} className="rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:col-span-2">{isSubmitting ? "অপেক্ষা করুন..." : submitLabel}</button>
    </form>
  );
}
