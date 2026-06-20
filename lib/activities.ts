import { Activity } from "./types";

export const activities: Activity[] = [
  {
    id: '1',
    slug: "summer-music-fest-2026",
    title: "Summer Music Fest 2026",
    category: "เทศกาลดนตรี",
    date: "2026-06-14",
    location: "สวนสาธารณะกลางเมือง พิษณุโลก",
    cover: "/images/x1.png",
    gallery: [
      "/images/x2.png",
      "/images/x2.png",
      "/images/x1.png",
    ],
    summary: "งานดนตรีกลางแจ้งรวมศิลปินอินดี้กว่า 12 วง ตลอดทั้งวัน",
    description:
      "เทศกาลดนตรีประจำปีที่รวบรวมศิลปินอินดี้จากทั่วประเทศมาขึ้นแสดงบนเวทีกลางแจ้ง พร้อมโซนอาหารและงานคราฟต์จากผู้ประกอบการท้องถิ่น เปิดประตูตั้งแต่เที่ยงวันจนถึงสี่ทุ่ม มีพื้นที่นั่งปิกนิกสำหรับครอบครัว และโซนยืนชมใกล้เวทีสำหรับคนที่อยากใกล้ชิดศิลปิน",
  },
  {
    id: '2',
    slug: "city-marathon-2026",
    title: "City Marathon 2026",
    category: "กีฬา",
    date: "2026-05-02",
    location: "ถนนสายหลัก เขตเมืองเก่า",
    cover: "/images/x2.png",
    gallery: ["/images/x2.png", "/images/x4.png"],
    summary: "งานวิ่งมาราธอนประจำปี ระยะทาง 5K, 10K และ 21K",
    description:
      "การแข่งขันวิ่งมาราธอนที่จัดต่อเนื่องเป็นปีที่ 8 เส้นทางวิ่งผ่านจุดสำคัญทางประวัติศาสตร์ของเมือง มีระยะให้เลือกตั้งแต่ฟันรัน 5 กิโลเมตร ไปจนถึงฮาล์ฟมาราธอน 21 กิโลเมตร พร้อมจุดบริการน้ำทุก 2.5 กิโลเมตร และพยาบาลประจำเส้นทาง",
  },
  {
    id: '3',
    slug: "art-market-weekend",
    title: "Art Market Weekend",
    category: "ศิลปะ",
    date: "2026-04-18",
    location: "ลานหน้าหอศิลป์",
    cover: "/images/x3.png",
    gallery: ["/images/x3.png", "/images/x1.png"],
    summary: "ตลาดนัดงานศิลปะและงานฝีมือจากศิลปินอิสระกว่า 40 ร้าน",
    description:
      "พื้นที่รวมตัวของศิลปินอิสระและนักออกแบบรุ่นใหม่ จัดแสดงและจำหน่ายผลงานตั้งแต่ภาพวาด เซรามิก เครื่องประดับ ไปจนถึงงานพิมพ์ลายมือ มีเวิร์กช็อปสอนวาดภาพฟรีให้เด็กๆ ทุกชั่วโมงตลอดสองวัน",
  },
  {
    id: '4',
    slug: "night-food-fair",
    title: "Night Food Fair",
    category: "อาหาร",
    date: "2026-03-22",
    location: "ลานกิจกรรมริมแม่น้ำ",
    cover: "/images/x4.png",
    gallery: ["/images/x4.png", "/images/x2.png"],
    summary: "งานรวมร้านอาหารกลางคืนกว่า 60 ร้าน พร้อมดนตรีสด",
    description:
      "งานเทศกาลอาหารยามค่ำคืนริมแม่น้ำ รวบรวมร้านอาหารสตรีทฟู้ดและร้านดังในพื้นที่กว่า 60 ร้าน พร้อมเวทีดนตรีสดตลอดงาน บรรยากาศร่มรื่นเหมาะกับการพาครอบครัวมาเดินเล่นและทานอาหารยามเย็น",
  },
];

export function getAllActivities(): Activity[] {
  return [...activities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}
