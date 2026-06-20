import { NextRequest, NextResponse } from "next/server";
import { getAllCategories, createCategory } from "@/lib/db/categories";
import { isAdminAuthed } from "@/lib/auth";

export async function GET() {
  const categories = await getAllCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "กรุณาระบุชื่อหมวดหมู่" }, { status: 400 });
  }
  const category = await createCategory(name);
  return NextResponse.json({ category }, { status: 201 });
}
