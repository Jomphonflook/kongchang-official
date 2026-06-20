import { NextRequest, NextResponse } from "next/server";
import { getAllActivities, createActivity } from "@/lib/db/activities";
import { saveUploadedImages, UploadError } from "@/lib/upload";
import { isAdminAuthed } from "@/lib/auth";

// GET /api/activities — public listing (also used by the admin dashboard).
export async function GET() {
  const activities = await getAllActivities();
  return NextResponse.json({ activities });
}

// POST /api/activities — admin only. multipart/form-data with files.
export async function POST(request: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์เข้าถึง" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const summary = String(formData.get("summary") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!title || !category || !date || !location || !summary || !description) {
      return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
    }

    const coverFile = formData.get("cover");
    if (!(coverFile instanceof File) || coverFile.size === 0) {
      return NextResponse.json({ error: "กรุณาแนบรูปปก" }, { status: 400 });
    }
    const [cover] = await saveUploadedImages([coverFile], "activities");

    const galleryFiles = formData
      .getAll("gallery")
      .filter((f): f is File => f instanceof File && f.size > 0);
    const gallery = await saveUploadedImages(galleryFiles, "activities");

    const activity = await createActivity({
      title,
      category,
      date,
      location,
      summary,
      description,
      cover,
      gallery: gallery.length ? gallery : [cover],
      slug: title,
    });
    return NextResponse.json({ activity }, { status: 201 });
  } catch (err) {
    if (err instanceof UploadError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Failed to create activity:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด กรุณาลองใหม่" }, { status: 500 });
  }
}
