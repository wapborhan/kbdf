import mongoose from "mongoose";
const S = new mongoose.Schema({ name: String, phone: String, message: String, read: { type: Boolean, default: false } }, { timestamps: true });
export default mongoose.models.Message || mongoose.model("Message", S);
