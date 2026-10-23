import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { contactSchema } from "@/lib/validators";
export async function POST(req) {
  try {
    const p = contactSchema.safeParse(await req.json());
    if (!p.success) return NextResponse.json({ error: p.error.flatten() }, { status: 400 });
    await connectDB();
    await Message.create(p.data);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch { return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 }); }
}
