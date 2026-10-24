import { z } from "zod";
import { BLOOD_GROUPS, RELIGIONS } from "./constants";
const phone = z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন");
export const donorSchema = z.object({
  name: z.string().trim().min(2, "নাম দিন").max(80),
  email: z.string().trim().toLowerCase().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  phone,
  bloodGroup: z.enum(BLOOD_GROUPS, { errorMap: () => ({ message: "রক্তের গ্রুপ নির্বাচন করুন" }) }),
  upazila: z.string().min(2, "উপজেলা নির্বাচন করুন"),
  address: z.string().trim().max(200).optional(),
  note: z.string().trim().max(500).optional(),
  facebookUrl: z.string().url("সঠিক লিংক দিন").optional().or(z.literal("")),
  photoUrl: z.string().url("সঠিক লিংক দিন").optional().or(z.literal("")),
  lastDonationDate: z.string().optional(),
});
export const requestSchema = z.object({
  patientName: z.string().trim().min(2, "রোগীর নাম দিন").max(80),
  bloodGroup: z.enum(BLOOD_GROUPS, { errorMap: () => ({ message: "রক্তের গ্রুপ নির্বাচন করুন" }) }),
  units: z.coerce.number().int().min(1).max(10),
  hospital: z.string().trim().min(2, "হাসপাতালের নাম দিন").max(120),
  upazila: z.string().min(2, "উপজেলা নির্বাচন করুন"),
  neededBy: z.string().min(1, "তারিখ নির্বাচন করুন"),
  contactPhone: phone,
  note: z.string().trim().max(1000).optional(),
});
export const contactSchema = z.object({
  name: z.string().trim().min(2, "নাম দিন").max(80),
  phone,
  message: z.string().trim().min(5, "বার্তা লিখুন").max(1000),
});

const pick = (arr, m) => z.enum(arr, { errorMap: () => ({ message: m }) });
const opt = z.string().trim().max(150).optional();
const need = {
  student: [["className", "শ্রেণি/বর্ষ লিখুন"], ["institutionName", "স্কুল/প্রতিষ্ঠানের নাম লিখুন"], ["institutionAddress", "প্রতিষ্ঠানের ঠিকানা লিখুন"]],
  job_holder: [["companyName", "প্রতিষ্ঠানের নাম লিখুন"], ["position", "পদবী লিখুন"], ["companyAddress", "প্রতিষ্ঠানের ঠিকানা লিখুন"]],
  other: [["professionDetails", "পেশার বিবরণ লিখুন"]],
};
export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "পূর্ণ নাম দিন").max(80),
  gender: pick(["male", "female", "other"], "লিঙ্গ নির্বাচন করুন"),
  fatherName: z.string().trim().min(2, "পিতার নাম দিন").max(80),
  motherName: z.string().trim().min(2, "মাতার নাম দিন").max(80),
  birthDate: z.string().min(1, "জন্মতারিখ নির্বাচন করুন").refine((v) => new Date(v) < new Date(), "সঠিক জন্মতারিখ দিন"),
  address: z.string().trim().min(5, "ঠিকানা দিন").max(200),
  whatsapp: phone,
  religion: pick(RELIGIONS, "ধর্ম নির্বাচন করুন"),
  maritalStatus: pick(["married", "unmarried"], "বৈবাহিক অবস্থা নির্বাচন করুন"),
  profession: pick(["student", "job_holder", "other"], "পেশা নির্বাচন করুন"),
  className: opt, institutionName: opt, institutionAddress: opt,
  companyName: opt, position: opt, companyAddress: opt,
  professionDetails: z.string().trim().max(300).optional(),
  publicConsent: z.boolean().optional(),
}).superRefine((d, ctx) => {
  for (const [k, message] of need[d.profession] || []) if (!d[k]?.trim()) ctx.addIssue({ code: "custom", path: [k], message });
});
export const PROFESSION_FIELDS = { student: ["className", "institutionName", "institutionAddress"], job_holder: ["companyName", "position", "companyAddress"], other: ["professionDetails"] };
