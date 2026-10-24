import mongoose from "mongoose";
const S = new mongoose.Schema({
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true, index: true },
  units: { type: Number, default: 1 },
  hospital: { type: String, required: true },
  upazila: { type: String, required: true },
  neededBy: { type: Date, required: true },
  contactPhone: { type: String, required: true },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdByName: String,
  status: { type: String, enum: ["pending", "approved", "fulfilled", "cancelled"], default: "pending", index: true },
}, { timestamps: true });
export default mongoose.models.BloodRequest || mongoose.model("BloodRequest", S);
