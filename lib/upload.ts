import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadError extends Error {}

function guessExt(type: string): string {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".jpg";
  }
}

// Saves an uploaded image under /public/uploads/<subdir>/ and returns a path
// served via /api/uploads/ so it bypasses Next.js dev static-file caching.
export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError(
      `ไฟล์ประเภท "${file.type || "ไม่ทราบ"}" ไม่รองรับ (รองรับเฉพาะรูปภาพ JPG, PNG, WEBP, GIF)`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ที่เล็กลง");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name).toLowerCase() || guessExt(file.type);
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", subdir);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), bytes);
  return `/api/uploads/${subdir}/${filename}`;
}

export async function saveUploadedImages(files: File[], subdir: string): Promise<string[]> {
  const out: string[] = [];
  for (const file of files) {
    if (!file || file.size === 0) continue;
    // eslint-disable-next-line no-await-in-loop
    out.push(await saveUploadedImage(file, subdir));
  }
  return out;
}

export async function deleteUploadedFile(publicPath: string): Promise<void> {
  if (!publicPath) return;
  // Support both /uploads/... (old) and /api/uploads/... (new)
  let relativePath: string | null = null;
  if (publicPath.startsWith("/api/uploads/")) {
    relativePath = publicPath.replace("/api/uploads/", "uploads/");
  } else if (publicPath.startsWith("/uploads/")) {
    relativePath = publicPath.slice(1); // strip leading slash
  }
  if (!relativePath) return;
  const filePath = path.join(process.cwd(), "public", relativePath);
  try {
    await fs.unlink(filePath);
  } catch {
    // File already missing — nothing to do.
  }
}
