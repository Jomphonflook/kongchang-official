import { TicketStatus, statusLabel } from "@/lib/types";

const STYLES: Record<TicketStatus, string> = {
  open: "bg-accent/10 text-accent border-accent/30",
  in_progress: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  done: "bg-emerald-600/10 text-emerald-700 border-emerald-600/30",
  rejected: "bg-muted/10 text-muted border-muted/30",
};

export default function StatusBadge({ status }: { status: TicketStatus | string }) {
  const cls = STYLES[status as TicketStatus] ?? STYLES.open;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}
