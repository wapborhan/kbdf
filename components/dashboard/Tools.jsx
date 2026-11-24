"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, MessageCircle, Phone, CheckCircle2, Ban, Eye } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import Modal from "@/components/Modal";
import DonorForm from "@/components/forms/DonorForm";
import RequestForm from "@/components/forms/RequestForm";
import ProfileInfo from "@/components/dashboard/ProfileInfo";
import { LABEL } from "@/components/dashboard/ui";
import { REQUEST_STATUSES } from "@/lib/constants";
import { ROLES, ROLE_LABEL } from "@/lib/permissions";
import { toWa } from "@/lib/utils";

function useMutate() {
  const { authFetch } = useAuth(); const router = useRouter();
  return async (url, method, body, msg) => {
    const r = await authFetch(url, { method, body: body && JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) { toast.success(j.pending ? "জমা হয়েছে — অ্যাডমিন/মডারেটরের অনুমোদনের অপেক্ষায়" : msg); router.refresh(); return true; }
    toast.error(j.error || "ব্যর্থ হয়েছে"); return false;
  };
}
const sel = "rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none transition focus:border-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";
const addBtn = "flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-700";
const iconBtn = "rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-slate-700";
const donorForm = (d) => ({ name: d.name, phone: d.phone, email: d.email || "", bloodGroup: d.bloodGroup, upazila: d.upazila, address: d.address || "", note: d.note || "", facebookUrl: d.facebookUrl || "", photoUrl: d.photoUrl || "", lastDonationDate: d.lastDonationDate ? String(d.lastDonationDate).slice(0, 10) : "" });
const requestForm = (r) => ({ patientName: r.patientName, bloodGroup: r.bloodGroup, units: r.units, hospital: r.hospital, upazila: r.upazila, neededBy: String(r.neededBy).slice(0, 10), contactPhone: r.contactPhone, note: r.note || "" });

// ---- donors ----
export function AddDonorButton() {
  const [open, setOpen] = useState(false); const m = useMutate();
  return <><button onClick={() => setOpen(true)} className={addBtn}><Plus className="h-4 w-4" />দাতা যোগ করুন</button>
    {open && <Modal title="নতুন দাতা যোগ করুন" onClose={() => setOpen(false)}><DonorForm onSubmit={async (d) => { const ok = await m("/api/admin/donors", "POST", d, "দাতা যোগ হয়েছে"); if (ok) setOpen(false); return ok; }} /></Modal>}</>;
}
export function DonorStatus({ id, value }) {
  const m = useMutate();
  return <select key={value} defaultValue={value} className={sel} onChange={(e) => m(`/api/admin/donors/${id}`, "PATCH", { value: e.target.value }, "অবস্থা বদলেছে")}>{["active", "pending", "inactive"].map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}</select>;
}
export function DonorActions({ d, staff }) {
  const [open, setOpen] = useState(false); const m = useMutate();
  return (
    <div className="flex justify-end gap-1">
      <a href={`https://wa.me/${toWa(d.phone)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className={`${iconBtn} text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40`}><MessageCircle className="h-4 w-4" /></a>
      {staff && <>
        <button title="সম্পাদনা" onClick={() => setOpen(true)} className={`${iconBtn} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40`}><Pencil className="h-4 w-4" /></button>
        <button title="মুছুন" onClick={() => confirm(`"${d.name}" কে মুছে ফেলবেন?`) && m(`/api/admin/donors/${d._id}`, "DELETE", null, "মুছে ফেলা হয়েছে")} className={`${iconBtn} text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40`}><Trash2 className="h-4 w-4" /></button>
        {open && <Modal title="দাতার তথ্য সম্পাদনা" onClose={() => setOpen(false)}><DonorForm defaultValues={donorForm(d)} submitLabel="হালনাগাদ করুন" onSubmit={async (x) => { const ok = await m(`/api/admin/donors/${d._id}`, "PUT", x, "হালনাগাদ হয়েছে"); if (ok) setOpen(false); return ok; }} /></Modal>}
      </>}
    </div>
  );
}

// ---- requests ----
export function AddRequestButton() {
  const [open, setOpen] = useState(false); const m = useMutate();
  return <><button onClick={() => setOpen(true)} className={addBtn}><Plus className="h-4 w-4" />আবেদন যোগ করুন</button>
    {open && <Modal title="নতুন আবেদন যোগ করুন" onClose={() => setOpen(false)}><RequestForm onSubmit={async (d) => { const ok = await m("/api/admin/requests", "POST", d, "আবেদন যোগ হয়েছে"); if (ok) setOpen(false); return ok; }} /></Modal>}</>;
}
export function RequestStatus({ id, value }) {
  const m = useMutate();
  return <select key={value} defaultValue={value} className={sel} onChange={(e) => m(`/api/admin/requests/${id}`, "PATCH", { value: e.target.value }, "অবস্থা বদলেছে")}>{REQUEST_STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}</select>;
}
export function RequestActions({ r, staff, canEdit }) {
  const [open, setOpen] = useState(false); const m = useMutate();
  return (
    <div className="flex justify-end gap-1">
      {staff && r.status === "pending" && <button title="অনুমোদন করুন" onClick={() => m(`/api/admin/requests/${r._id}`, "PATCH", { value: "approved" }, "আবেদন অনুমোদিত হয়েছে")} className={`${iconBtn} text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40`}><CheckCircle2 className="h-4 w-4" /></button>}
      <a href={`tel:${r.contactPhone}`} title="কল" className={`${iconBtn} text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40`}><Phone className="h-4 w-4" /></a>
      {canEdit && <button title="সম্পাদনা" onClick={() => setOpen(true)} className={`${iconBtn} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40`}><Pencil className="h-4 w-4" /></button>}
      {staff && <button title="মুছুন" onClick={() => confirm(`"${r.patientName}" এর আবেদন মুছে ফেলবেন?`) && m(`/api/admin/requests/${r._id}`, "DELETE", null, "মুছে ফেলা হয়েছে")} className={`${iconBtn} text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40`}><Trash2 className="h-4 w-4" /></button>}
      {open && <Modal title="আবেদন সম্পাদনা" onClose={() => setOpen(false)}><RequestForm defaultValues={requestForm(r)} submitLabel="হালনাগাদ করুন" onSubmit={async (x) => { const ok = await m(`/api/admin/requests/${r._id}`, "PUT", x, "হালনাগাদ হয়েছে"); if (ok) setOpen(false); return ok; }} /></Modal>}
    </div>
  );
}

// ---- users ----
export function RoleSelect({ id, value }) {
  const m = useMutate();
  return <select key={value} defaultValue={value} className={sel} onChange={(e) => m(`/api/admin/users/${id}`, "PATCH", { value: e.target.value }, "রোল পরিবর্তন হয়েছে")}>{ROLES.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select>;
}
export function UserActions({ id, name, approved, profile, canToggle }) {
  const [open, setOpen] = useState(false); const m = useMutate();
  return (
    <div className="flex items-center justify-end gap-1">
      <button title="বিস্তারিত তথ্য" onClick={() => setOpen(true)} className={`${iconBtn} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40`}><Eye className="h-4 w-4" /></button>
      {canToggle && (approved
        ? <button onClick={() => confirm(`${name} এর প্রবেশাধিকার বাতিল করবেন?`) && m(`/api/admin/users/${id}`, "PATCH", { field: "approved", value: false }, "প্রবেশাধিকার বাতিল হয়েছে")} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"><Ban className="h-4 w-4" />বাতিল</button>
        : <button onClick={() => m(`/api/admin/users/${id}`, "PATCH", { field: "approved", value: true }, "অনুমোদন দেওয়া হয়েছে")} className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4" />অনুমোদন</button>)}
      {open && <Modal title={name} onClose={() => setOpen(false)}><ProfileInfo d={profile} /></Modal>}
    </div>
  );
}
