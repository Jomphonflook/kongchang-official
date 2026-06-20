export interface Activity {
  id: string; // Mongo ObjectId as string
  slug: string;
  title: string;
  category: string;
  date: string; // ISO date e.g. "2026-06-14"
  location: string;
  cover: string; // path under /public/uploads or /public/images
  gallery: string[]; // additional image paths
  summary: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TicketStatus = "open" | "in_progress" | "done" | "rejected";

export const TICKET_STATUSES: { value: TicketStatus; label: string }[] = [
  { value: "open", label: "เปิดเรื่อง" },
  { value: "in_progress", label: "กำลังดำเนินการ" },
  { value: "done", label: "เสร็จสิ้น" },
  { value: "rejected", label: "ไม่ดำเนินการ" },
];

export function statusLabel(status: string): string {
  return TICKET_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export interface Ticket {
  id: string; // Mongo ObjectId as string
  code: string; // friendly tracking code e.g. TK-XXXXXX
  title: string;
  description: string;
  category: string;
  name: string;
  phone: string;
  images: string[];
  status: TicketStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt?: string;
}
