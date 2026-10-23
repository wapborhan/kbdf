"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useState } from "react";
import { donorSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
import { BLOOD_GROUPS, UPAZILAS } from "@/lib/constants";
export default function Register() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(donorSchema) });
  async function onSubmit(data) {
    const res = await fetch("/api/donors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await res.json().catch(() => ({}));
    if (res.ok) { setDone(true); reset(); toast.success("নিবন্ধন জমা হয়েছে"); }
    else toast.error(typeof j.error === "string" ? j.error : "তথ্য যাচাই করে আবার চেষ্টা করুন");
  }
  if (done) return <div className="mx-auto max-w-lg px-4 py-20 text-center"><h1 className="text-2xl font-bold text-brand-700">ধন্যবাদ!</h1><p className="mt-3 text-gray-600">আপনার তথ্য অ্যাডমিনের অনুমোদনের অপেক্ষায় আছে। অনুমোদনের পর আপনি রক্তদাতা তালিকায় আসবেন।</p></div>;
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">রক্তদাতা হিসেবে নিবন্ধন করুন</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <Field label="নাম *" error={errors.name}><input className={inputCls} {...register("name")} /></Field>
        <Field label="WhatsApp নম্বর *" error={errors.phone}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" {...register("phone")} /></Field>
        <Field label="ইমেইল (ঐচ্ছিক)" error={errors.email}><input className={inputCls} type="email" {...register("email")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="রক্তের গ্রুপ *" error={errors.bloodGroup}><select className={inputCls} defaultValue="" {...register("bloodGroup")}><option value="" disabled>নির্বাচন করুন</option>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select></Field>
          <Field label="উপজেলা *" error={errors.upazila}><select className={inputCls} defaultValue="" {...register("upazila")}><option value="" disabled>নির্বাচন করুন</option>{UPAZILAS.map((u) => <option key={u}>{u}</option>)}</select></Field>
        </div>
        <Field label="ঠিকানা" error={errors.address}><input className={inputCls} {...register("address")} /></Field>
        <Field label="সর্বশেষ রক্তদানের তারিখ" error={errors.lastDonationDate}><input type="date" className={inputCls} {...register("lastDonationDate")} /></Field>
        <Field label="Facebook প্রোফাইল লিংক" error={errors.facebookUrl}><input className={inputCls} placeholder="https://facebook.com/..." {...register("facebookUrl")} /></Field>
        <Field label="ছবির URL" error={errors.photoUrl}><input className={inputCls} placeholder="https://..." {...register("photoUrl")} /></Field>
        <p className="text-xs text-gray-500">জমা দিলে আপনি সম্মতি দিচ্ছেন যে অনুমোদনের পর আপনার নাম, গ্রুপ, উপজেলা ও যোগাযোগ মাধ্যম সবার কাছে দৃশ্যমান হবে।</p>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? "জমা হচ্ছে..." : "নিবন্ধন জমা দিন"}</button>
      </form>
    </div>
  );
}
