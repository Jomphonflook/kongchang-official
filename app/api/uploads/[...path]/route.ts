import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Dynamic file server for /uploads/* to work around Next.js dev-mode
// not picking up files written to /public/uploads at runtime.
export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const filePath = path.join(
    process.cwd(),
    "public",
    "uploads",
    ...params.path
  );

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase().replace(".", "");
    const mimeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
    };
    const contentType = mimeMap[ext] ?? "application/octet-stream";

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache for 1 year in prod; no-cache in dev so edits are instant
        "Cache-Control":
          process.env.NODE_ENV === "production"
            ? "public, max-age=31536000, immutable"
            : "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 404 });
  }
}
