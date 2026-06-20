import { NextRequest, NextResponse } from "next/server";
import { getTicketByCodeAndPhone } from "@/lib/db/tickets";

// GET /api/tickets/track?code=...&phone=... — public. Requires both the
// tracking code AND the phone number used when filing, for basic privacy.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim();
  const phone = searchParams.get("phone")?.trim();

  if (!code || !phone) {
    return NextResponse.json({ error: "กรุณาระบุรหัสติดตามและเบอร์โทร" }, { status: 400 });
  }

  const ticket = await getTicketByCodeAndPhone(code, phone);
  if (!ticket) {
    return NextResponse.json(
      { error: "ไม่พบข้อมูล กรุณาตรวจสอบรหัสติดตามและเบอร์โทรอีกครั้ง" },
      { status: 404 }
    );
  }
  return NextResponse.json({ ticket });
}
