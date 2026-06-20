"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "เพิ่มไม่สำเร็จ");
        return;
      }
      setName("");
      router.refresh();
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        maxLength={50}
        placeholder="ชื่อหมวดหมู่ใหม่"
        className="min-w-[200px] flex-1 border border-line/20 bg-paper px-3 py-2 text-ink outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={saving}
        className="bg-ink px-5 py-2 font-mono text-xs uppercase tracking-wider text-paper hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
      </button>
      {error && <span className="font-mono text-xs text-accent">{error}</span>}
    </form>
  );
}
