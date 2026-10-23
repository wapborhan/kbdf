"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { requestSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
export default function NewRequest() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(requestSchema), defaultValues: { units: 1 } });
  async function onSubmit(data) {
    const res = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { setDone(true); reset(); toast.success("আবেদন জমা হয়েছে"); } else toast.error("তথ্য যাচাই করে আবার চেষ্টা করুন");
  }
  if (done) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-bold text-brand-700">আবেদন জমা হয়েছে</h1><p className="mt-3 text-gray-600">অ্যাডমিন যাচাই করে প্রকাশ করবেন। জরুরি হলে সরাসরি <a className="text-brand-600 underline" href="/donors">রক্তদাতা তালিকা</a> থেকে যোগাযোগ করুন।</p></div>;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তের জন্য আবেদন করুন</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <Field label="রোগীর নাম *" error={errors.patientName}><input className={inputCls} {...register("patientName")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="রক্তের গ্রুপ *" error={errors.bloodGroup}><select className={inputCls} defaultValue="" {...register("bloodGroup")}><option value="" disabled>নির্বাচন করুন</option>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select></Field>
          <Field label="ব্যাগ সংখ্যা *" error={errors.units}><input type="number" min="1" max="10" className={inputCls} {...register("units")} /></Field>
        </div>
        <Field label="হাসপাতাল *" error={errors.hospital}><input className={inputCls} {...register("hospital")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="উপজেলা *" error={errors.upazila}><select className={inputCls} defaultValue="" {...register("upazila")}><option value="" disabled>নির্বাচন করুন</option>{UPAZILAS.map((u) => <option key={u}>{u}</option>)}</select></Field>
          <Field label="কবে প্রয়োজন *" error={errors.neededBy}><input type="date" className={inputCls} {...register("neededBy")} /></Field>
        </div>
        <Field label="যোগাযোগের নম্বর *" error={errors.contactPhone}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" {...register("contactPhone")} /></Field>
        <Field label="অতিরিক্ত তথ্য" error={errors.note}><textarea rows={3} className={inputCls} {...register("note")} /></Field>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? "জমা হচ্ছে..." : "আবেদন জমা দিন"}</button>
      </form>
    </div>
  );
}
