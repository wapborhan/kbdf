"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
import DatePicker from "@/components/DatePicker";
import Textarea from "@/components/Textarea";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
import { todayISO } from "@/lib/utils";

export default function RequestForm({ onSubmit, defaultValues = { units: 1 }, submitLabel = "সংরক্ষণ করুন" }) {
  const { register, handleSubmit, control, watch, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(requestSchema), defaultValues });
  const go = async (d) => { if (await onSubmit(d)) reset(defaultValues); };
  const sel = (n, label, arr) => <Field label={label} error={errors[n]}><select className={inputCls} {...register(n)}><option value="">নির্বাচন করুন</option>{arr.map((o) => <option key={o}>{o}</option>)}</select></Field>;
  const inp = (n, label, x = {}) => <Field label={label} error={errors[n]}><input className={inputCls} {...x} {...register(n)} /></Field>;
  return (
    <form onSubmit={handleSubmit(go)} className="grid gap-4 sm:grid-cols-2">
      {inp("patientName", "রোগীর নাম *")}{sel("bloodGroup", "রক্তের গ্রুপ *", BLOOD_GROUPS)}
      {inp("units", "ব্যাগ সংখ্যা *", { type: "number", min: 1, max: 10 })}{inp("hospital", "হাসপাতাল *")}
      {sel("upazila", "উপজেলা *", UPAZILAS)}
      <Field label="কবে প্রয়োজন *" error={errors.neededBy}>
        <Controller name="neededBy" control={control} render={({ field }) => <DatePicker value={field.value || ""} onChange={field.onChange} min={todayISO()} />} />
      </Field>
      <div className="sm:col-span-2">{inp("contactPhone", "যোগাযোগের নম্বর *", { inputMode: "tel", placeholder: "01XXXXXXXXX" })}</div>
      <div className="sm:col-span-2"><Field label="অতিরিক্ত নোট" error={errors.note}><Textarea max={1000} length={(watch("note") || "").length} placeholder="রোগীর অবস্থা, হাসপাতালের ওয়ার্ড/বেড নম্বর, কার সাথে যোগাযোগ করবেন..." {...register("note")} /></Field></div>
      <button disabled={isSubmitting} className="rounded-xl bg-brand-600 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60 sm:col-span-2">{isSubmitting ? "অপেক্ষা করুন..." : submitLabel}</button>
    </form>
  );
}
