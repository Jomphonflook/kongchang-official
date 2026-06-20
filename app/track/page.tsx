"use client";

import { useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import { Ticket } from "@/lib/types";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setTicket(null);
    setLoading(true);
    try {
      const params = new URLSearchParams({ code, phone });
      const res = await fetch(`/api/tickets/track?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ไม่พบข้อมูล");
        return;
      }
      setTicket(data.ticket);
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">ตรวจสอบสถานะ</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink">ติดตามเรื่องที่แจ้ง</h1>
      <p className="mt-3 text-sm text-muted">กรอกรหัสติดตามและเบอร์โทรที่ใช้แจ้งเรื่อง</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-muted">
            รหัสติดตาม
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="TK-XXXXXXX-XXXX"
            className="mt-2 w-full border-b border-line/20 bg-transparent py-2 font-mono uppercase tracking-wide text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-muted">เบอร์โทร</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="08X-XXX-XXXX"
            className="mt-2 w-full border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="focus-ring bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "กำลังค้นหา..." : "ตรวจสอบ"}
        </button>
      </form>

      {error && <p className="mt-6 text-sm text-accent">{error}</p>}

      {ticket && (
        <div className="mt-10 border border-line/15 p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{ticket.category}</p>
            <StatusBadge status={ticket.status} />
          </div>
          <h2 className="mt-2 font-display text-xl font-bold text-ink">{ticket.title}</h2>
          {ticket.description && (
            <p className="mt-3 whitespace-pre-line text-sm text-ink/80">{ticket.description}</p>
          )}
          {ticket.adminNote && (
            <div className="mt-4 border-t border-line/10 pt-4">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                หมายเหตุจากเจ้าหน้าที่
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink/80">{ticket.adminNote}</p>
            </div>
          )}
          <p className="mt-4 font-mono text-xs text-muted">
            แจ้งเมื่อ {formatDateTime(ticket.createdAt)} · อัปเดตล่าสุด {formatDateTime(ticket.updatedAt)}
          </p>
        </div>
      )}
    </div>
  );
}
