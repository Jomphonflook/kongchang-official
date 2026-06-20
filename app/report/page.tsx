import type { Metadata } from "next";
import Link from "next/link";
import TicketForm from "@/components/TicketForm";

export const metadata: Metadata = {
  title: "แจ้งเรื่อง",
  description: "แจ้งข้อมูล รายงานเรื่อง หรือส่งข่าวสารถึงเจ้าหน้าที่",
};

export default function ReportPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">แจ้งเรื่อง</p>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
        แจ้งข้อมูล
      </h1>
      <p className="mt-3 max-w-lg text-sm text-muted">
        กรอกแบบฟอร์มด้านล่างเพื่อแจ้งเรื่องหรือส่งข่าวสารถึงเจ้าหน้าที่ ระบบจะออกรหัสติดตามให้หลังส่งสำเร็จ
        ใช้รหัสนี้คู่กับเบอร์โทรเพื่อตรวจสอบสถานะภายหลังได้ที่หน้า{" "}
        <Link href="/track" className="text-accent underline underline-offset-2">
          ตรวจสอบสถานะ
        </Link>
      </p>

      <div className="mt-10">
        <TicketForm />
      </div>
    </div>
  );
}
