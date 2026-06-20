import { NextRequest, NextResponse } from "next/server";
import { getTicketById, updateTicket, deleteTicket } from "@/lib/db/tickets";
import { isAdminAuthed } from "@/lib/auth";
import { TICKET_STATUSES } from "@/lib/types";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const ticket = await getTicketById(params.id);
  if (!ticket) {
    return NextResponse.json({ error: "ไม่พบ ticket" }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const validStatuses = TICKET_STATUSES.map((s) => s.value);
  if (body.status && !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "สถานะไม่ถูกต้อง" }, { status: 400 });
  }

  const ticket = await updateTicket(params.id, {
    status: body.status,
    adminNote: typeof body.adminNote === "string" ? body.adminNote : undefined,
  });
  if (!ticket) {
    return NextResponse.json({ error: "ไม่พบ ticket" }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const ok = await deleteTicket(params.id);
  if (!ok) {
    return NextResponse.json({ error: "ไม่พบ ticket" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
