"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "@/lib/types";

export default function ActivityForm({ activity }: { activity?: Activity }) {
  const router = useRouter();
  const isEdit = Boolean(activity);

  const [coverPreview, setCoverPreview] = useState<string | null>(activity?.cover ?? null);
  const [keepGallery, setKeepGallery] = useState<string[]>(activity?.gallery ?? []);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setNewGalleryFiles(files);
    setNewGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  function removeKeepImage(src: string) {
    setKeepGallery((prev) => prev.filter((s) => s !== src));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    newGalleryFiles.forEach((file) => formData.append("gallery", file));
    if (isEdit) {
      formData.append("keepGallery", JSON.stringify(keepGallery));
    }

    try {
      const url = isEdit ? `/api/activities/${activity!.id}` : "/api/activities";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "บันทึกไม่สำเร็จ");
        return;
      }
      router.push("/admin/activities");
      router.refresh();
    } catch {
      setError("เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <p className="border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">{error}</p>
      )}

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">
          ชื่อกิจกรรม *
        </label>
        <input
          name="title"
          defaultValue={activity?.title}
          required
          maxLength={150}
          className="mt-2 w-full border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-muted">
            หมวดหมู่ *
          </label>
          <input
            name="category"
            defaultValue={activity?.category}
            required
            className="mt-2 w-full border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-muted">
            วันที่ *
          </label>
          <input
            type="date"
            name="date"
            defaultValue={activity?.date}
            required
            className="mt-2 w-full border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">สถานที่ *</label>
        <input
          name="location"
          defaultValue={activity?.location}
          required
          className="mt-2 w-full border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">สรุปย่อ *</label>
        <textarea
          name="summary"
          defaultValue={activity?.summary}
          required
          rows={2}
          className="mt-2 w-full resize-none border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">
          รายละเอียด *
        </label>
        <textarea
          name="description"
          defaultValue={activity?.description}
          required
          rows={6}
          className="mt-2 w-full resize-none border-b border-line/20 bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">
          รูปปก {isEdit ? "(เลือกใหม่เพื่อแทนที่)" : "*"}
        </label>
        <input
          type="file"
          name="cover"
          accept="image/*"
          required={!isEdit}
          onChange={handleCoverChange}
          className="mt-2 block w-full text-sm text-ink file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:font-mono file:text-xs file:uppercase file:tracking-wider file:text-paper hover:file:bg-ink/80"
        />
        {coverPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverPreview}
            alt="ตัวอย่างรูปปก"
            className="mt-3 aspect-video w-full max-w-sm rounded-sm object-cover"
          />
        )}
      </div>

      {isEdit && keepGallery.length > 0 && (
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-muted">
            รูปแกลเลอรีปัจจุบัน
          </label>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {keepGallery.map((src) => (
              <div key={src} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="aspect-square w-full rounded-sm object-cover" />
                <button
                  type="button"
                  onClick={() => removeKeepImage(src)}
                  className="absolute right-1 top-1 bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] text-paper opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="font-mono text-xs uppercase tracking-widest text-muted">
          {isEdit ? "เพิ่มรูปแกลเลอรี" : "รูปแกลเลอรี"}
        </label>
        <input
          type="file"
          name="galleryInput"
          accept="image/*"
          multiple
          onChange={handleGalleryChange}
          className="mt-2 block w-full text-sm text-ink file:mr-4 file:border-0 file:bg-ink file:px-4 file:py-2 file:font-mono file:text-xs file:uppercase file:tracking-wider file:text-paper hover:file:bg-ink/80"
        />
        {newGalleryPreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {newGalleryPreviews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={src} src={src} alt="" className="aspect-square w-full rounded-sm object-cover" />
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="focus-ring bg-ink px-6 py-3 font-mono text-xs uppercase tracking-widest text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "กำลังบันทึก..." : isEdit ? "บันทึกการแก้ไข" : "เผยแพร่กิจกรรม"}
      </button>
    </form>
  );
}
