import { notFound } from "next/navigation";
import Link from "next/link";
import { getTicketById } from "@/lib/db/tickets";
import StatusBadge from "@/components/StatusBadge";
import TicketDetailActions from "@/components/admin/TicketDetailActions";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminTicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ticket = await getTicketById(params.id);
  if (!ticket) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/tickets" className="font-mono text-xs text-muted hover:text-ink">
        ← Ticket ทั้งหมด
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {ticket.category} · {ticket.code}
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-ink">{ticket.title}</h1>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line/10 py-6 font-mono text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">ผู้แจ้ง</dt>
          <dd className="mt-1 text-ink">{ticket.name}</dd>
        </div>
        <div>
          <dt className="text-muted">เบอร์โทร</dt>
          <dd className="mt-1 text-ink">{ticket.phone}</dd>
        </div>
        <div>
          <dt className="text-muted">แจ้งเมื่อ</dt>
          <dd className="mt-1 text-ink">{formatDateTime(ticket.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-muted">อัปเดตล่าสุด</dt>
          <dd className="mt-1 text-ink">{formatDateTime(ticket.updatedAt)}</dd>
        </div>
      </dl>

      {ticket.description && (
        <div className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">รายละเอียด</h2>
          <p className="mt-2 whitespace-pre-line text-ink/90">{ticket.description}</p>
        </div>
      )}

      {ticket.images.length > 0 && (
        <div className="mt-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted">รูปแนบ</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ticket.images.map((src, i) => (
              <a key={src} href={src} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`แนบรูป ${i + 1}`}
                  className="aspect-square w-full rounded-sm object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-line/10 pt-8">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted">จัดการ</h2>
        <TicketDetailActions
          ticketId={ticket.id}
          status={ticket.status}
          adminNote={ticket.adminNote ?? ""}
        />
      </div>
    </div>
  );
}
