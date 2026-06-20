import Link from "next/link";
import { getAllActivities } from "@/lib/db/activities";
import DeleteActivityButton from "@/components/admin/DeleteActivityButton";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminActivitiesPage() {
  const activities = await getAllActivities();

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">กิจกรรม</h1>
        <Link
          href="/admin/activities/new"
          className="bg-ink px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-paper hover:opacity-90"
        >
          + เพิ่มกิจกรรม
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((a) => (
          <div key={a.id} className="border border-line/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.cover} alt={a.title} className="aspect-[4/3] w-full object-cover" />
            <div className="p-4">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                {a.category} · {formatDate(a.date)}
              </p>
              <h3 className="mt-1 font-display text-base font-bold text-ink">{a.title}</h3>
              <div className="mt-4 flex items-center gap-4 font-mono text-xs uppercase tracking-wider">
                <Link href={`/admin/activities/${a.id}/edit`} className="text-accent hover:underline">
                  แก้ไข
                </Link>
                <Link href={`/activities/${a.id}`} target="_blank" className="text-muted hover:text-ink">
                  ดูหน้าจริง
                </Link>
                <DeleteActivityButton activityId={a.id} title={a.title} />
              </div>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-muted">ยังไม่มีกิจกรรม กดปุ่ม “เพิ่มกิจกรรม” เพื่อเริ่มต้น</p>
        )}
      </div>
    </div>
  );
}
