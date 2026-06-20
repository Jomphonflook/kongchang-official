import Link from "next/link";
import { getAllActivities } from "@/lib/db/activities";
import ActivityCard from "@/components/ActivityCard";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function HomePage() {
  console.log('01>>>')
  const activities = await getAllActivities();

  const [latest, ...rest] = activities;

  if (activities.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          ยังไม่มีกิจกรรม
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">
          ยังไม่มีกิจกรรมเผยแพร่ในขณะนี้
        </h1>
        <p className="mt-3 text-sm text-muted">
          เจ้าหน้าที่สามารถเข้าสู่ระบบแอดมินเพื่อเพิ่มกิจกรรมแรกได้
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      {/* Hero: latest activity, full-bleed */}
      {latest && (
        <section className="relative border-b border-line/5 bg-ink">
          <Link href={`/activities/${latest.id}`} className="focus-ring group block relative overflow-hidden">
            <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={latest.cover}
                alt={latest.title}
                className="h-full w-full object-cover opacity-75 transition-all duration-1000 ease-out scale-100 group-hover:scale-105 group-hover:opacity-80"
              />

              {/* Subtle ambient light glow for modern depth */}
              <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-accent/25 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-60" />

              {/* Rich cinematic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-12 sm:pb-16 z-10">
                {/* Modern Pulsating Live Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-[11px] font-mono uppercase tracking-widest text-accent backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
                  </span>
                  ล่าสุด · {formatDate(latest.date)}
                </div>

                <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] text-paper sm:text-5xl md:text-6xl tracking-tight transition-colors duration-300 group-hover:text-white">
                  {latest.title}
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2 ml-3 text-accent">
                    →
                  </span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm text-paper/80 font-normal leading-relaxed sm:text-base">
                  {latest.summary}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Grid of remaining activities */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between border-b border-ink/5 pb-5">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1 rounded-full bg-accent" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">กิจกรรมทั้งหมด</h2>
          </div>
          <span className="rounded-full bg-ink/5 px-3 py-1 font-mono text-xs font-medium text-muted">
            {activities.length} รายการ
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((activity, i) => (
            <ActivityCard key={activity.id} activity={activity} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
