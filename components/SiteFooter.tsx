export default function SiteFooter() {
  return (
    <footer className="border-t border-line/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6">
        {/* <p className="font-mono text-xs text-muted">
          บันทึกภาพและเรื่องราวจากกิจกรรมต่างๆ
        </p> */}
        <a
          href="/admin/login"
          className="focus-ring font-mono text-xs text-muted/60 transition-colors hover:text-ink"
        >
          สำหรับเจ้าหน้าที่
        </a>
      </div>
    </footer>
  );
}
