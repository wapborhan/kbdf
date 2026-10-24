"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/dashboard/ui";
import ProfileForm from "@/components/forms/ProfileForm";
export default function EditProfile({ profile }) {
  const { saveProfile } = useAuth();
  const router = useRouter();
  async function onSubmit(data) {
    const r = await saveProfile(data);
    if (r.ok) { toast.success("প্রোফাইল হালনাগাদ হয়েছে"); router.push("/dashboard/profile"); router.refresh(); }
    else toast.error(r.error || "সংরক্ষণ ব্যর্থ হয়েছে");
  }
  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/dashboard/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"><ArrowLeft className="h-4 w-4" />প্রোফাইলে ফিরুন</Link>
      <Card className="p-5 sm:p-8">
        <h2 className="text-lg font-bold">প্রোফাইল সম্পাদনা</h2>
        <p className="mb-6 mt-1 text-sm text-gray-500">{profile.email}</p>
        <ProfileForm defaultValues={{ fullName: profile.name, ...profile.details }} submitLabel="হালনাগাদ করুন" onSubmit={onSubmit} />
      </Card>
    </div>
  );
}
