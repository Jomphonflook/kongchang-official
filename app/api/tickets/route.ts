import { NextRequest, NextResponse } from "next/server";
import { createTicket, getTickets, getTicketStats } from "@/lib/db/tickets";
import { saveUploadedImages, UploadError } from "@/lib/upload";
import { isAdminAuthed } from "@/lib/auth";

// GET /api/tickets — admin only. List + optional filters + optional stats.
export async function GET(request: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const includeStats = searchParams.get("stats") === "1";

  const tickets = await getTickets({ status, category });
  if (includeStats) {
    const stats = await getTicketStats();
    return NextResponse.json({ tickets, stats });
  }
  return NextResponse.json({ tickets });
}

// POST /api/tickets — public. Anyone can open a ticket, no auth required.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();

    if (!title || !category || !name || !phone) {
      return NextResponse.json(
        { error: "กรุณากรอกหัวเรื่อง หมวดหมู่ ชื่อ และเบอร์โทรให้ครบถ้วน" },
        { status: 400 }
      );
    }
    if (title.length > 150) {
      return NextResponse.json({ error: "หัวเรื่องยาวเกินไป" }, { status: 400 });
    }
    if (!/^[0-9+\-\s()]{6,20}$/.test(phone)) {
      return NextResponse.json({ error: "รูปแบบเบอร์โทรไม่ถูกต้อง" }, { status: 400 });
    }

    const files = formData.getAll("images").filter((f): f is File => f instanceof File);
    if (files.length > 5) {
      return NextResponse.json({ error: "แนบรูปได้สูงสุด 5 รูป" }, { status: 400 });
    }
    const images = await saveUploadedImages(files, "tickets");

    const ticket = await createTicket({ title, description, category, name, phone, images });
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Failed to create ticket:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
