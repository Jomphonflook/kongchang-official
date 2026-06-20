// Seeds MongoDB with the original sample activities, the two default ticket
// categories, and sets up useful indexes. Safe to re-run (upserts by unique
// key, never duplicates).
//
// Usage: npm run seed   (reads MONGODB_URI from .env.local)
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/activity-gallery";

const activities = [
  {
    slug: "summer-music-fest-2026",
    title: "Summer Music Fest 2026",
    category: "เทศกาลดนตรี",
    date: "2026-06-14",
    location: "สวนสาธารณะกลางเมือง พิษณุโลก",
    cover: "/images/placeholder-1.jpg",
    gallery: ["/images/placeholder-1.jpg", "/images/placeholder-2.jpg", "/images/placeholder-3.jpg"],
    summary: "งานดนตรีกลางแจ้งรวมศิลปินอินดี้กว่า 12 วง ตลอดทั้งวัน",
    description:
      "เทศกาลดนตรีประจำปีที่รวบรวมศิลปินอินดี้จากทั่วประเทศมาขึ้นแสดงบนเวทีกลางแจ้ง พร้อมโซนอาหารและงานคราฟต์จากผู้ประกอบการท้องถิ่น เปิดประตูตั้งแต่เที่ยงวันจนถึงสี่ทุ่ม มีพื้นที่นั่งปิกนิกสำหรับครอบครัว และโซนยืนชมใกล้เวทีสำหรับคนที่อยากใกล้ชิดศิลปิน",
  },
  {
    slug: "city-marathon-2026",
    title: "City Marathon 2026",
    category: "กีฬา",
    date: "2026-05-02",
    location: "ถนนสายหลัก เขตเมืองเก่า",
    cover: "/images/placeholder-2.jpg",
    gallery: ["/images/placeholder-2.jpg", "/images/placeholder-4.jpg"],
    summary: "งานวิ่งมาราธอนประจำปี ระยะทาง 5K, 10K และ 21K",
    description:
      "การแข่งขันวิ่งมาราธอนที่จัดต่อเนื่องเป็นปีที่ 8 เส้นทางวิ่งผ่านจุดสำคัญทางประวัติศาสตร์ของเมือง มีระยะให้เลือกตั้งแต่ฟันรัน 5 กิโลเมตร ไปจนถึงฮาล์ฟมาราธอน 21 กิโลเมตร พร้อมจุดบริการน้ำทุก 2.5 กิโลเมตร และพยาบาลประจำเส้นทาง",
  },
  {
    slug: "art-market-weekend",
    title: "Art Market Weekend",
    category: "ศิลปะ",
    date: "2026-04-18",
    location: "ลานหน้าหอศิลป์",
    cover: "/images/placeholder-3.jpg",
    gallery: ["/images/placeholder-3.jpg", "/images/placeholder-1.jpg"],
    summary: "ตลาดนัดงานศิลปะและงานฝีมือจากศิลปินอิสระกว่า 40 ร้าน",
    description:
      "พื้นที่รวมตัวของศิลปินอิสระและนักออกแบบรุ่นใหม่ จัดแสดงและจำหน่ายผลงานตั้งแต่ภาพวาด เซรามิก เครื่องประดับ ไปจนถึงงานพิมพ์ลายมือ มีเวิร์กช็อปสอนวาดภาพฟรีให้เด็กๆ ทุกชั่วโมงตลอดสองวัน",
  },
  {
    slug: "night-food-fair",
    title: "Night Food Fair",
    category: "อาหาร",
    date: "2026-03-22",
    location: "ลานกิจกรรมริมแม่น้ำ",
    cover: "/images/placeholder-4.jpg",
    gallery: ["/images/placeholder-4.jpg", "/images/placeholder-2.jpg"],
    summary: "งานรวมร้านอาหารกลางคืนกว่า 60 ร้าน พร้อมดนตรีสด",
    description:
      "งานเทศกาลอาหารยามค่ำคืนริมแม่น้ำ รวบรวมร้านอาหารสตรีทฟู้ดและร้านดังในพื้นที่กว่า 60 ร้าน พร้อมเวทีดนตรีสดตลอดงาน บรรยากาศร่มรื่นเหมาะกับการพาครอบครัวมาเดินเล่นและทานอาหารยามเย็น",
  },
];

const categories = ["แจ้งเรื่อง", "ข่าวสาร"];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();

  const activitiesCol = db.collection("activities");
  await activitiesCol.createIndex({ slug: 1 }, { unique: true });
  for (const a of activities) {
    const now = new Date();
    // eslint-disable-next-line no-await-in-loop
    await activitiesCol.updateOne(
      { slug: a.slug },
      { $setOnInsert: { ...a, createdAt: now, updatedAt: now } },
      { upsert: true }
    );
  }

  const categoriesCol = db.collection("categories");
  await categoriesCol.createIndex({ name: 1 }, { unique: true });
  for (const name of categories) {
    // eslint-disable-next-line no-await-in-loop
    await categoriesCol.updateOne(
      { name },
      { $setOnInsert: { name, createdAt: new Date() } },
      { upsert: true }
    );
  }

  const ticketsCol = db.collection("tickets");
  await ticketsCol.createIndex({ code: 1 }, { unique: true });
  await ticketsCol.createIndex({ status: 1 });
  await ticketsCol.createIndex({ createdAt: -1 });

  console.log(`✓ Seeded ${activities.length} activities and ${categories.length} categories.`);
  console.log("✓ Created indexes for activities, categories, and tickets.");
  await client.close();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
