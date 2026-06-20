import Link from "next/link";
import { Activity } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ActivityCard({
  activity,
  index,
}: {
  activity: Activity;
  index: number;
}) {

  return (
    <Link
      href={`/activities/${activity.id}`}
      className="focus-ring group block rounded-2xl overflow-hidden bg-ink shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activity.cover}
          alt={activity.title}
          className="h-full w-full object-cover opacity-85 transition-all duration-700 ease-out scale-100 group-hover:scale-105 group-hover:opacity-100"
        />
        
        {/* Rich dark gradient overlay that deepens on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/20 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-95" />

        {/* Glassmorphic floating badges */}
        <div className="absolute left-4 top-4 rounded-full bg-ink/40 px-2.5 py-1 text-[10px] font-mono font-medium text-paper/90 backdrop-blur-md border border-paper/10 shadow-sm">
          #{String(index + 1).padStart(2, "0")}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-ink/40 px-2.5 py-1 text-[10px] font-mono font-medium text-paper/90 backdrop-blur-md border border-paper/10 shadow-sm">
          {formatDate(activity.date)}
        </div>

        {/* Content information layout */}
        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
          <span className="inline-block rounded bg-accent/20 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-accent mb-2.5">
            {activity.category}
          </span>
          <h3 className="font-display text-lg font-bold leading-snug text-paper group-hover:text-white transition-colors duration-300">
            {activity.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
