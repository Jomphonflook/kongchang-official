import { NextResponse } from "next/server";
import { deleteCategory } from "@/lib/db/categories";
import { isAdminAuthed } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const ok = await deleteCategory(params.id);
  if (!ok) {
    return NextResponse.json({ error: "ไม่พบหมวดหมู่" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
