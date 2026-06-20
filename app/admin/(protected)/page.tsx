import Link from "next/link";
import { getTicketStats, getTickets } from "@/lib/db/tickets";
import { getAllActivities } from "@/lib/db/activities";
import StatusBadge from "@/components/StatusBadge";
import { TICKET_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminDashboardPage() {
  const [stats, tickets, activities] = await Promise.all([
    getTicketStats(),
    getTickets(),
    getAllActivities(),
  ]);
  const latestTickets = tickets.slice(0, 6);
  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">ภาพรวม</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="border border-line/15 p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">Ticket ทั้งหมด</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{total}</p>
        </div>
        {TICKET_STATUSES.map((s) => (
          <div key={s.value} className="border border-line/15 p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold text-ink">{stats[s.value] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold text-ink">Ticket ล่าสุด</h2>
        <Link
          href="/admin/tickets"
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          ดูทั้งหมด →
        </Link>
      </div>
      <div className="mt-4 divide-y divide-line/10 border border-line/15">
        {latestTickets.length === 0 && (
          <p className="p-5 text-sm text-muted">ยังไม่มี ticket เข้ามา</p>
        )}
        {latestTickets.map((t) => (
          <Link
            key={t.id}
            href={`/admin/tickets/${t.id}`}
            className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-ink/[0.02]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{t.title}</p>
              <p className="font-mono text-xs text-muted">
                {t.code} · {t.category} · {formatDateTime(t.createdAt)}
              </p>
            </div>
            <StatusBadge status={t.status} />
          </Link>
        ))}
      </div>

      <div className="mt-12 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold text-ink">กิจกรรม</h2>
        <Link
          href="/admin/activities"
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          จัดการกิจกรรม →
        </Link>
      </div>
      <p className="mt-4 text-sm text-muted">มีกิจกรรมเผยแพร่อยู่ทั้งหมด {activities.length} รายการ</p>
    </div>
  );
}
