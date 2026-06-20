"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteActivityButton({
  activityId,
  title,
}: {
  activityId: string;
  title: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`ลบกิจกรรม "${title}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/activities/${activityId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-muted hover:text-accent disabled:opacity-50"
    >
      {deleting ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
