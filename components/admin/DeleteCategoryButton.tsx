"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({
  categoryId,
  name,
}: {
  categoryId: string;
  name: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`ลบหมวดหมู่ "${name}" ใช่หรือไม่?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/categories/${categoryId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent disabled:opacity-50"
    >
      {deleting ? "กำลังลบ..." : "ลบ"}
    </button>
  );
}
