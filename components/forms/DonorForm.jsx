"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donorSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
import DatePicker from "@/components/DatePicker";
import Textarea from "@/components/Textarea";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
import { todayISO } from "@/lib/utils";

// onSubmit(data) must return true on success (form resets) or false.
export default function DonorForm({ onSubmit, defaultValues = {}, submitLabel = "সংরক্ষণ করুন", consent }) {
  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(donorSchema), defaultValues });
  const go = async (d) => { if (await onSubmit(d)) reset(defaultValues); };
  const sel = (n, label, arr) => <Field label={label} error={errors[n]}><select className={inputCls} {...register(n)}><option value="">নির্বাচন করুন</option>{arr.map((o) => <option key={o}>{o}</option>)}</select></Field>;
  const inp = (n, label, x = {}) => <Field label={label} error={errors[n]}><input className={inputCls} {...x} {...register(n)} /></Field>;
  return (
    <form onSubmit={handleSubmit(go)} className="grid gap-4 sm:grid-cols-2">
      {inp("name", "নাম *")}{inp("phone", "WhatsApp নম্বর *", { inputMode: "tel", placeholder: "01XXXXXXXXX" })}
      {sel("bloodGroup", "রক্তের গ্রুপ *", BLOOD_GROUPS)}{sel("upazila", "উপজেলা *", UPAZILAS)}
      <Field label="সর্বশেষ রক্তদানের তারিখ" error={errors.lastDonationDate}>
        <Controller name="lastDonationDate" control={control} render={({ field }) => <DatePicker value={field.value || ""} onChange={field.onChange} max={todayISO()} />} />
      </Field>
      {inp("email", "ইমেইল (ঐচ্ছিক)", { type: "email" })}
      {inp("facebookUrl", "Facebook প্রোফাইল লিংক", { placeholder: "https://facebook.com/..." })}
      {inp("photoUrl", "ছবির URL", { placeholder: "https://..." })}
      <div className="sm:col-span-2"><Field label="ঠিকানা" error={errors.address}><Textarea max={200} length={(watch("address") || "").length} placeholder="গ্রাম/মহল্লা, থানা..." {...register("address")} /></Field></div>
      <div className="sm:col-span-2"><Field label="অতিরিক্ত নোট" error={errors.note}><Textarea max={500} length={(watch("note") || "").length} placeholder="যেমন: কোন সময় যোগাযোগ করা ভালো, স্বাস্থ্য সংক্রান্ত সতর্কতা..." {...register("note")} /></Field></div>
      {consent && <p className="text-xs text-gray-500 sm:col-span-2">জমা দিলে আপনি সম্মতি দিচ্ছেন যে অনুমোদনের পর আপনার নাম, গ্রুপ, উপজেলা ও যোগাযোগ মাধ্যম সবার কাছে দৃশ্যমান হবে।</p>}
      <button disabled={isSubmitting} className="rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:col-span-2">{isSubmitting ? "অপেক্ষা করুন..." : submitLabel}</button>
    </form>
  );
}
