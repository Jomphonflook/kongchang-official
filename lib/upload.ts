import { promises as fs } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export class UploadError extends Error {}

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper to extract Cloudinary public_id from URL
function getCloudinaryPublicId(url: string): string | null {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let pathAfterUpload = parts[1];
    // Remove the version segment (e.g. "v1570534579/") if it exists
    if (pathAfterUpload.startsWith("v")) {
      const slashIndex = pathAfterUpload.indexOf("/");
      if (slashIndex !== -1) {
        pathAfterUpload = pathAfterUpload.slice(slashIndex + 1);
      }
    }

    // Remove the file extension (e.g. ".jpg")
    const dotIndex = pathAfterUpload.lastIndexOf(".");
    if (dotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.slice(0, dotIndex);
    }

    return pathAfterUpload;
  } catch {
    return null;
  }
}

// Saves an uploaded image to Cloudinary and returns its secure URL.
export async function saveUploadedImage(file: File, subdir: string): Promise<string> {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new UploadError("ระบบ Cloudinary ยังไม่ได้ตั้งค่าในไฟล์ environment (.env)");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError(
      `ไฟล์ประเภท "${file.type || "ไม่ทราบ"}" ไม่รองรับ (รองรับเฉพาะรูปภาพ JPG, PNG, WEBP, GIF)`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ที่เล็กลง");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `activity-gallery/${subdir}`,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(new UploadError("อัปโหลดรูปภาพไปยัง Cloudinary ล้มเหลว"));
        } else {
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(bytes);
  });
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

  // If it's a Cloudinary URL, delete it from Cloudinary
  if (publicPath.includes("cloudinary.com")) {
    const publicId = getCloudinaryPublicId(publicPath);
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete Cloudinary asset:", err);
      }
    }
    return;
  }

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
