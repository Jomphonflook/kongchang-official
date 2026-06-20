import { notFound } from "next/navigation";
import Link from "next/link";
import { getActivityById } from "@/lib/db/activities";
import GalleryLightbox from "@/components/GalleryLightbox";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { id: string };
}) {

  const activity = await getActivityById(params.id);
  if (!activity) notFound();

  return (
    <article className="min-h-screen bg-[#fafaf8]">
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activity.cover}
          alt={activity.title}
          className="h-full w-full object-cover opacity-80"
        />

        {/* Subtle ambient light glow for modern depth */}
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen opacity-50" />

        {/* Cinematic dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-6 pb-12 z-10">
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-1.5 text-xs font-semibold text-paper/75 hover:text-white transition-colors duration-200"
          >
            <span className="text-sm">←</span> กิจกรรมทั้งหมด
          </Link>
          <div className="mt-4">
            <span className="inline-block rounded bg-accent/25 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-accent">
              {activity.category}
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-[1.2] text-paper sm:text-4xl md:text-5xl tracking-tight">
            {activity.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:justify-items-center border border-ink/5 bg-ink/[0.01] p-6 rounded-2xl shadow-sm">
          {/* Date info widget */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted font-body">วันที่</dt>
              <dd className="mt-0.5 text-[15px] font-bold text-ink">{formatDate(activity.date)}</dd>
            </div>
          </div>

          {/* Location info widget */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted font-body">สถานที่</dt>
              <dd className="mt-0.5 text-[15px] font-bold text-ink">{activity.location}</dd>
            </div>
          </div>

          {/* Category info widget */}
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 5h6m-6 4h6m-6 4h6" />
              </svg>
            </div>
            <div>
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted font-body">หมวดหมู่</dt>
              <dd className="mt-0.5 text-[15px] font-bold text-ink">{activity.category}</dd>
            </div>
          </div>
        </dl>

        <p className="mt-10 whitespace-pre-line text-base leading-relaxed text-ink/80 font-normal sm:text-lg">
          {activity.description}
        </p>

        {activity.gallery.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="h-5 w-1 rounded-full bg-accent" />
              <h2 className="font-display text-xl font-bold text-ink">ภาพกิจกรรม</h2>
            </div>
            <GalleryLightbox images={activity.gallery} title={activity.title} />
          </div>
        )}
      </div>
    </article>
  );
}
