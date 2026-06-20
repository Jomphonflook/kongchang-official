"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/tickets", label: "Ticket" },
  { href: "/admin/activities", label: "กิจกรรม" },
  { href: "/admin/categories", label: "หมวดหมู่" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-lg font-bold text-ink">
            {/* สำนักงานกองช่าง<span className="text-accent"></span>{" "} */}
            <span className="font-mono text-xs font-normal text-muted">ADMIN</span>
          </Link>
          <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted">
            {links.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/admin" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-ink ${active ? "text-ink" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-mono text-xs text-muted hover:text-ink">
            ดูเว็บไซต์
          </Link>
          <button
            onClick={handleLogout}
            className="focus-ring font-mono text-xs uppercase tracking-wider text-accent hover:underline"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
}
