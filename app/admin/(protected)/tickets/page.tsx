import Link from "next/link";
import { getTickets } from "@/lib/db/tickets";
import { getAllCategories } from "@/lib/db/categories";
import TicketStatusSelect from "@/components/admin/TicketStatusSelect";
import { TICKET_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminTicketsPage({
  searchParams,
}: {
  searchParams: { status?: string; category?: string };
}) {
  const [tickets, categories] = await Promise.all([
    getTickets({ status: searchParams.status, category: searchParams.category }),
    getAllCategories(),
  ]);

  const hasFilter = Boolean(searchParams.status || searchParams.category);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Ticket ทั้งหมด</h1>
        <p className="font-mono text-xs text-muted">{tickets.length} รายการ</p>
      </div>

      <form className="mt-6 flex flex-wrap items-center gap-4" method="get">
        <select
          name="status"
          defaultValue={searchParams.status || ""}
          className="border border-line/20 bg-paper px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink"
        >
          <option value="">ทุกสถานะ</option>
          {TICKET_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={searchParams.category || ""}
          className="border border-line/20 bg-paper px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="border border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wider text-paper hover:opacity-90"
        >
          กรอง
        </button>
        {hasFilter && (
          <Link
            href="/admin/tickets"
            className="px-2 py-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-ink"
          >
            ล้างตัวกรอง
          </Link>
        )}
      </form>

      <div className="mt-8 overflow-x-auto border border-line/15">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-line/15 font-mono text-xs uppercase tracking-wider text-muted">
              <th className="p-4">รหัส</th>
              <th className="p-4">เรื่อง</th>
              <th className="p-4">หมวดหมู่</th>
              <th className="p-4">ผู้แจ้ง</th>
              <th className="p-4">วันที่</th>
              <th className="p-4">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/10">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-ink/[0.02]">
                <td className="p-4 font-mono text-xs">
                  <Link href={`/admin/tickets/${t.id}`} className="text-ink hover:text-accent">
                    {t.code}
                  </Link>
                </td>
                <td className="max-w-[240px] truncate p-4 text-ink">{t.title}</td>
                <td className="p-4 text-muted">{t.category}</td>
                <td className="p-4 text-muted">{t.name}</td>
                <td className="p-4 font-mono text-xs text-muted">{formatDateTime(t.createdAt)}</td>
                <td className="p-4">
                  <TicketStatusSelect ticketId={t.id} status={t.status} />
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted">
                  ไม่พบ ticket
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
