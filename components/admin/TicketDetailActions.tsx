"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TICKET_STATUSES, TicketStatus } from "@/lib/types";

export default function TicketDetailActions({
  ticketId,
  status,
  adminNote,
}: {
  ticketId: string;
  status: TicketStatus;
  adminNote: string;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [note, setNote] = useState(adminNote);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, adminNote: note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "บันทึกไม่สำเร็จ");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 space-y-6">
      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">สถานะ</label>
        <select
          value={currentStatus}
          onChange={(e) => {
            setCurrentStatus(e.target.value as TicketStatus);
            setSaved(false);
          }}
          className="mt-2 w-full border border-line/20 bg-paper px-3 py-2 text-ink sm:w-64"
        >
          {TICKET_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">
          หมายเหตุถึงผู้แจ้ง
        </label>
        <textarea
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setSaved(false);
          }}
          rows={4}
          placeholder="ผู้แจ้งจะเห็นข้อความนี้เมื่อตรวจสอบสถานะที่หน้า /track"
          className="mt-2 w-full border border-line/20 bg-paper p-3 text-ink outline-none focus:border-accent"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="focus-ring bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "กำลังบันทึก..." : saved ? "บันทึกแล้ว ✓" : "บันทึกการเปลี่ยนแปลง"}
      </button>
    </div>
  );
}
