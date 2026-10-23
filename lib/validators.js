import { z } from "zod";
import { BLOOD_GROUPS } from "./constants";
const phone = z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন");
export const donorSchema = z.object({
  name: z.string().trim().min(2, "নাম দিন").max(80),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
  phone, // WhatsApp number
  bloodGroup: z.enum(BLOOD_GROUPS),
  upazila: z.string().min(2),
  address: z.string().trim().max(200).optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
  lastDonationDate: z.string().optional(),
});
export const requestSchema = z.object({
  patientName: z.string().trim().min(2).max(80),
  bloodGroup: z.enum(BLOOD_GROUPS),
  units: z.coerce.number().int().min(1).max(10),
  hospital: z.string().trim().min(2).max(120),
  upazila: z.string().min(2),
  neededBy: z.string().min(1),
  contactPhone: phone,
  note: z.string().trim().max(500).optional(),
});
export const contactSchema = z.object({
  name: z.string().trim().min(2, "নাম দিন").max(80),
  phone,
  message: z.string().trim().min(5, "বার্তা লিখুন").max(1000),
});
