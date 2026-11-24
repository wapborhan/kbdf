"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { contactSchema } from "@/lib/validators";
import Field, { inputCls } from "@/components/Field";
export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(contactSchema) });
  async function onSubmit(data) {
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) { toast.success("বার্তা পাঠানো হয়েছে"); reset(); } else toast.error("পাঠানো যায়নি, আবার চেষ্টা করুন");
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold sm:text-3xl">যোগাযোগ</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition dark:bg-slate-800 dark:ring-slate-700">
        <Field label="নাম" error={errors.name}><input className={inputCls} {...register("name")} /></Field>
        <Field label="মোবাইল নম্বর" error={errors.phone}><input className={inputCls} inputMode="tel" {...register("phone")} /></Field>
        <Field label="বার্তা" error={errors.message}><textarea rows={4} className={inputCls} {...register("message")} /></Field>
        <button disabled={isSubmitting} className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}</button>
      </form>
    </div>
  );
}
