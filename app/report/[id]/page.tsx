import { notFound } from "next/navigation";
import Link from "next/link";
import { getTicketById } from "@/lib/db/tickets";
import StatusBadge from "@/components/StatusBadge";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function TicketConfirmationPage({
  params,
}: {
  params: { id: string };
}) {
  const ticket = await getTicketById(params.id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">ส่งเรื่องสำเร็จ</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink">บันทึกข้อมูลของคุณแล้ว</h1>
      <p className="mt-3 text-sm text-muted">
        เก็บรหัสติดตามนี้ไว้ — ใช้คู่กับเบอร์โทรเพื่อตรวจสอบสถานะภายหลัง
      </p>

      <div className="mt-8 border border-line/15 p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">รหัสติดตาม</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wide text-ink">{ticket.code}</p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-line/10 pt-6">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">เรื่อง</p>
            <p className="mt-1 truncate text-ink">{ticket.title}</p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="mt-4 font-mono text-xs text-muted">ส่งเมื่อ {formatDateTime(ticket.createdAt)}</p>
      </div>

      <div className="mt-8 flex gap-6 font-mono text-xs uppercase tracking-widest">
        <Link href="/track" className="text-accent hover:underline">
          ตรวจสอบสถานะภายหลัง
        </Link>
        <Link href="/" className="text-muted hover:text-ink">
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}
