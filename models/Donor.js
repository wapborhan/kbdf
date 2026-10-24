import mongoose from "mongoose";
const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, lowercase: true, trim: true, sparse: true, unique: true },
  phone: { type: String, required: true, unique: true },
  bloodGroup: { type: String, required: true, index: true },
  upazila: { type: String, required: true, index: true },
  address: String, note: String, facebookUrl: String, photoUrl: String,
  lastDonationDate: Date,
  status: { type: String, enum: ["pending", "active", "inactive"], default: "pending", index: true },
}, { timestamps: true });
export default mongoose.models.Donor || mongoose.model("Donor", DonorSchema);
