import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="focus-ring font-display text-xl font-bold tracking-tight text-ink"
        >
          สำนักงานกองช่าง<span className="text-accent"></span>
        </Link>
        <nav className="flex items-center gap-2 font-body">
          <Link
            href="/"
            className="focus-ring rounded-xl border border-line/10 px-4 py-2 text-sm font-medium text-ink transition-all duration-300 hover:bg-ink hover:text-paper"
          >
            กิจกรรมทั้งหมด
          </Link>
          <Link
            href="/track"
            className="focus-ring rounded-xl border border-line/10 px-4 py-2 text-sm font-medium text-ink transition-all duration-300 hover:bg-ink hover:text-paper"
          >
            ตรวจสอบสถานะ
          </Link>
          <Link
            href="/report"
            className="focus-ring rounded-xl bg-accent px-6 py-2 text-sm font-semibold text-paper shadow-sm transition-all duration-300 hover:bg-[#e04f1a] hover:shadow-md"
          >
            แจ้งเรื่อง
          </Link>
        </nav>
      </div>
    </header>
  );
}
