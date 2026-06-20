"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/lib/types";

export default function TicketForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setError("โหลดหมวดหมู่ไม่สำเร็จ ลองรีเฟรชหน้านี้อีกครั้ง"));
  }, []);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incomingFiles = Array.from(fileList);
    const newFiles = [...images, ...incomingFiles].slice(0, 5);
    previews.forEach((url) => URL.revokeObjectURL(url));
    setImages(newFiles);
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)));
  }

  function removeImage(index: number) {
    const updatedImages = images.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    images.forEach((file) => formData.append("images", file));

    try {
      const res = await fetch("/api/tickets", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setSubmitting(false);
        return;
      }
      router.push(`/report/${data.ticket.id}`);
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/[0.03] p-4 text-sm text-accent">
          <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium leading-relaxed">{error}</span>
        </div>
      )}

      <div>
        <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
          หัวเรื่อง *
        </label>
        <input
          name="title"
          required
          maxLength={150}
          placeholder="สรุปเรื่องสั้นๆ"
          className="mt-2 w-full rounded-xl border border-ink/10 bg-paper/50 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5"
        />
      </div>

      <div>
        <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
          หมวดหมู่ *
        </label>
        <div className="relative mt-2">
          <select
            name="category"
            required
            defaultValue=""
            className="w-full appearance-none rounded-xl border border-ink/10 bg-paper/50 px-4 py-3 pr-10 text-sm text-ink outline-none transition-all duration-300 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5"
          >
            <option value="" disabled>
              เลือกหมวดหมู่
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted/60">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
          รายละเอียด
        </label>
        <textarea
          name="description"
          rows={5}
          placeholder="อธิบายรายละเอียดเพิ่มเติม (ถ้ามี)"
          className="mt-2 w-full resize-none rounded-xl border border-ink/10 bg-paper/50 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
            ชื่อผู้แจ้ง *
          </label>
          <input
            name="name"
            required
            maxLength={80}
            placeholder="ชื่อ-นามสกุล"
            className="mt-2 w-full rounded-xl border border-ink/10 bg-paper/50 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5"
          />
        </div>
        <div>
          <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
            เบอร์โทร *
          </label>
          <input
            name="phone"
            required
            maxLength={20}
            placeholder="08X-XXX-XXXX"
            className="mt-2 w-full rounded-xl border border-ink/10 bg-paper/50 px-4 py-3 text-sm text-ink outline-none transition-all duration-300 placeholder:text-muted/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/5"
          />
        </div>
      </div>

      <div>
        <label className="block font-mono text-[13px] font-bold uppercase tracking-wider text-muted/90">
          แนบรูปภาพ (สูงสุด 5 รูป)
        </label>
        
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`group mt-2 flex flex-col items-center justify-center rounded-2xl border border-dashed p-8 text-center transition-all duration-300 ${
            isDragActive
              ? "border-accent bg-accent/[0.02]"
              : "border-ink/10 bg-paper hover:border-accent/30 hover:bg-ink/[0.01]"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink/[0.03] text-muted/70 transition-transform duration-300 group-hover:scale-110">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
            </svg>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-1 text-sm">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md font-semibold text-accent transition-colors hover:text-accent/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2"
            >
              <span>แนบไฟล์ภาพ</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
            <span className="text-muted/80">หรือลากไฟล์มาวางที่นี่</span>
          </div>
          <p className="mt-1.5 text-xs text-muted/50">PNG, JPG, WEBP ขนาดไม่เกิน 5MB</p>
        </div>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {previews.map((src, i) => (
              <div
                key={src}
                className="group relative aspect-square overflow-hidden rounded-xl border border-ink/5 bg-ink shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`แนบรูป ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-paper transition-all hover:bg-accent hover:scale-110 shadow-md focus:outline-none"
                  aria-label="ลบรูปภาพ"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring group inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-7 py-3.5 font-display text-sm font-semibold uppercase tracking-wider text-paper transition-all duration-300 hover:bg-ink/90 hover:shadow-lg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto"
      >
        {submitting ? (
          <>
            <svg className="h-4 w-4 animate-spin text-paper" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังส่ง...
          </>
        ) : (
          <>
            ส่งเรื่อง
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
