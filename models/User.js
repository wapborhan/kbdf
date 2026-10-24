import mongoose from "mongoose";
const Profile = new mongoose.Schema({
  fullName: String,
  gender: { type: String, enum: ["male", "female", "other"] },
  fatherName: String, motherName: String, birthDate: Date, address: String, whatsapp: String, religion: String, publicConsent: Boolean,
  maritalStatus: { type: String, enum: ["married", "unmarried"] },
  profession: { type: String, enum: ["student", "job_holder", "other"] },
  className: String, institutionName: String, institutionAddress: String,
  companyName: String, position: String, companyAddress: String, professionDetails: String,
}, { _id: false });
const S = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, lowercase: true, index: true },
  name: String,
  photoUrl: String,
  role: { type: String, enum: ["user", "volunteer", "moderator", "admin"], default: "user" },
  approved: { type: Boolean, default: false },
  profile: Profile,
  profileComplete: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", S);
