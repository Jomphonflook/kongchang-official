import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminAuthed()) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
