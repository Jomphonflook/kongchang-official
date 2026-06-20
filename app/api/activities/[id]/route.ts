import { NextRequest, NextResponse } from "next/server";
import {
  getActivityById,
  updateActivity,
  deleteActivity,
} from "@/lib/db/activities";
import { saveUploadedImages, deleteUploadedFile, UploadError } from "@/lib/upload";
import { isAdminAuthed } from "@/lib/auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const activity = await getActivityById(params.id);
  if (!activity) {
    return NextResponse.json({ error: "ไม่พบกิจกรรม" }, { status: 404 });
  }
  return NextResponse.json({ activity });
}

// PATCH /api/activities/[id] — admin only. multipart/form-data.
// Optional new "cover" file replaces the old one. Optional new "gallery"
// files are appended to whatever is listed in "keepGallery" (JSON array of
// paths the admin chose to keep from the existing gallery).
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }

  try {
    const existing = await getActivityById(params.id);
    if (!existing) {
      return NextResponse.json({ error: "ไม่พบกิจกรรม" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = String(formData.get("title") || existing.title).trim();
    const category = String(formData.get("category") || existing.category).trim();
    const date = String(formData.get("date") || existing.date).trim();
    const location = String(formData.get("location") || existing.location).trim();
    const summary = String(formData.get("summary") || existing.summary).trim();
    const description = String(formData.get("description") || existing.description).trim();

    let keepGallery = existing.gallery;
    const keepGalleryRaw = formData.get("keepGallery");
    if (typeof keepGalleryRaw === "string") {
      try {
        const parsed = JSON.parse(keepGalleryRaw);
        if (Array.isArray(parsed)) keepGallery = parsed.filter((p) => typeof p === "string");
      } catch {
        // ignore malformed input, fall back to existing gallery
      }
    }

    let cover = existing.cover;
    const coverFile = formData.get("cover");
    if (coverFile instanceof File && coverFile.size > 0) {
      const [saved] = await saveUploadedImages([coverFile], "activities");
      cover = saved;
      if (existing.cover && existing.cover !== cover) {
        await deleteUploadedFile(existing.cover);
      }
    }

    const newGalleryFiles = formData
      .getAll("gallery")
      .filter((f): f is File => f instanceof File && f.size > 0);
    const newGallery = await saveUploadedImages(newGalleryFiles, "activities");

    // Clean up any removed gallery images that are no longer referenced.
    const removed = existing.gallery.filter(
      (g) => !keepGallery.includes(g) && g !== cover
    );
    await Promise.all(removed.map((g) => deleteUploadedFile(g)));

    const gallery = [...keepGallery, ...newGallery];

    const updated = await updateActivity(params.id, {
      title,
      category,
      date,
      location,
      summary,
      description,
      cover,
      gallery: gallery.length ? gallery : [cover],
    });
    return NextResponse.json({ activity: updated });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Failed to update activity:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }
  const existing = await getActivityById(params.id);
  const ok = await deleteActivity(params.id);
  if (!ok || !existing) {
    return NextResponse.json({ error: "ไม่พบกิจกรรม" }, { status: 404 });
  }
  const files = Array.from(new Set([existing.cover, ...existing.gallery]));
  await Promise.all(files.map((f) => deleteUploadedFile(f)));
  return NextResponse.json({ ok: true });
}
