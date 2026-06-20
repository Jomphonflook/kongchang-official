# Frame — เว็บไซต์โพสต์รูปและกิจกรรม + ระบบแจ้งเรื่อง (Ticket)

โปรเจกต์ Next.js 14 (App Router) + TypeScript + Tailwind CSS

- **Frontend + Backend**: Next.js เดียวกัน ใช้ App Router API Routes (`app/api/**/route.ts`) เป็น backend ทั้งหมด ไม่มีเซิร์ฟเวอร์แยก
- **Database**: MongoDB (รัน local) ผ่าน driver `mongodb` ตรงๆ ไม่มี ORM
- **ไฟล์รูปภาพที่อัปโหลด**: เก็บไว้ใน `public/uploads/` (local filesystem) — เหมาะกับการรันบนเครื่องเดียว ถ้าจะ deploy ขึ้น production จริงควรย้ายไปใช้ object storage (S3 / Supabase Storage ฯลฯ) แทน เพราะ filesystem ของ serverless host ส่วนใหญ่ไม่ persistent

## ฟีเจอร์

### ฝั่งผู้ใช้ทั่วไป (ไม่ต้อง login)
- `/` — หน้าแรก แสดงกิจกรรมทั้งหมด (ดึงจาก MongoDB)
- `/activities/[slug]` — หน้ารายละเอียดกิจกรรม
- `/report` — แบบฟอร์มเปิด ticket แจ้งเรื่อง/ข่าวสาร: หัวเรื่อง, หมวดหมู่ (ดึงจาก DB, แอดมินเพิ่มได้), รายละเอียด, ชื่อ, เบอร์โทร, แนบรูปได้สูงสุด 5 รูป — ส่งแล้วได้ "รหัสติดตาม" กลับมา
- `/track` — ตรวจสอบสถานะ ticket ด้วยรหัสติดตาม + เบอร์โทร (ป้องกันคนอื่นมาดูข้อมูลของเราโดยไม่รู้เบอร์โทร)

### ฝั่งแอดมิน (`/admin`, ต้อง login)
- `/admin/login` — เข้าสู่ระบบด้วย username/password (เก็บใน `.env.local`)
- `/admin` — ภาพรวม: จำนวน ticket แยกตามสถานะ, ticket ล่าสุด, จำนวนกิจกรรม
- `/admin/tickets` — ตาราง ticket ทั้งหมด กรองตามสถานะ/หมวดหมู่ได้ เปลี่ยนสถานะได้จากตารางเลย
- `/admin/tickets/[id]` — รายละเอียด ticket เต็ม (รูปแนบ, ผู้แจ้ง, เบอร์โทร) + เปลี่ยนสถานะ + ใส่หมายเหตุถึงผู้แจ้ง (ผู้แจ้งจะเห็นที่หน้า `/track`)
- `/admin/activities` — รายการกิจกรรม, เพิ่ม/แก้ไข/ลบ พร้อมอัปโหลดรูปปกและรูปแกลเลอรี
- `/admin/categories` — จัดการหมวดหมู่ที่ใช้ในฟอร์มแจ้งเรื่อง (เพิ่ม/ลบ)

สถานะ ticket: `เปิดเรื่อง` (open) → `กำลังดำเนินการ` (in_progress) → `เสร็จสิ้น` (done) หรือ `ไม่ดำเนินการ` (rejected) — ผู้ใช้ทั่วไปกำหนดเองไม่ได้ ค่าเริ่มต้นคือ `เปิดเรื่อง` เสมอ แอดมินเป็นคนเปลี่ยนสถานะ

## วิธีรันโปรเจกต์

### 1. เตรียม MongoDB local
ติดตั้งและรัน MongoDB บนเครื่องตัวเอง เช่น

```bash
# macOS (Homebrew)
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# หรือใช้ Docker
docker run -d --name activity-gallery-mongo -p 27017:27017 mongo
```

### 2. ตั้งค่า environment variables

```bash
cp .env.local.example .env.local
```

แล้วแก้ค่าใน `.env.local` ตามต้องการ (อย่างน้อยควรเปลี่ยน `ADMIN_PASSWORD` และ `SESSION_SECRET` ก่อนใช้งานจริง):

```
MONGODB_URI=mongodb://127.0.0.1:27017/activity-gallery
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
SESSION_SECRET=สุ่มสตริงยาวๆ-เช่นรัน-openssl-rand-hex-32
```

### 3. ติดตั้ง dependencies

```bash
npm install
```

### 4. (แนะนำ) Seed ข้อมูลตัวอย่าง

```bash
npm run seed
```

จะใส่กิจกรรมตัวอย่าง 4 รายการ, หมวดหมู่เริ่มต้น (แจ้งเรื่อง / ข่าวสาร) และสร้าง index ที่จำเป็น
(หมวดหมู่ทั้งสองจะถูกสร้างอัตโนมัติอยู่แล้วครั้งแรกที่มีคนเปิดฟอร์ม `/report` แม้ไม่รัน seed — แต่กิจกรรมตัวอย่างต้อง seed เอง หรือเพิ่มเองผ่าน `/admin/activities`)

### 5. รันเซิร์ฟเวอร์

```bash
npm run dev
```

เปิด http://localhost:3000 และ http://localhost:3000/admin/login (login ด้วยค่าจาก `.env.local`)

## โครงสร้างโปรเจกต์

```
app/
  layout.tsx                       # Layout หลัก + font + header/footer
  page.tsx                         # หน้าแรก (hero + grid กิจกรรม)
  activities/[slug]/page.tsx       # หน้ารายละเอียดกิจกรรม
  report/
    page.tsx                       # ฟอร์มเปิด ticket (public)
    [id]/page.tsx                  # หน้ายืนยันหลังส่ง ticket สำเร็จ
  track/page.tsx                   # ตรวจสอบสถานะ ticket (public)
  admin/
    login/page.tsx                 # หน้า login แอดมิน (public)
    (protected)/                   # ทุกหน้าในนี้ต้อง login ก่อน (เช็คใน layout.tsx)
      layout.tsx
      page.tsx                     # ภาพรวม/dashboard
      tickets/page.tsx             # ตาราง ticket + ตัวกรอง
      tickets/[id]/page.tsx        # รายละเอียด ticket
      activities/page.tsx          # รายการกิจกรรม (สำหรับแอดมิน)
      activities/new/page.tsx
      activities/[id]/edit/page.tsx
      categories/page.tsx          # จัดการหมวดหมู่
  api/
    activities/route.ts            # GET (public) / POST (admin)
    activities/[id]/route.ts       # GET / PATCH / DELETE (แก้ไข-ลบ = admin)
    tickets/route.ts               # GET (admin) / POST (public)
    tickets/[id]/route.ts          # GET / PATCH / DELETE (admin)
    tickets/track/route.ts         # GET (public, ต้องมีรหัส+เบอร์โทร)
    categories/route.ts            # GET (public) / POST (admin)
    categories/[id]/route.ts       # DELETE (admin)
    admin/login/route.ts           # POST — ตรวจสอบ credential ออก cookie
    admin/logout/route.ts          # POST — ล้าง cookie
components/
  SiteHeader.tsx / SiteFooter.tsx
  ActivityCard.tsx
  TicketForm.tsx                   # ฟอร์มแจ้งเรื่องฝั่ง public
  StatusBadge.tsx
  admin/                           # คอมโพเนนต์เฉพาะฝั่งแอดมิน
lib/
  types.ts                         # Type ของ Activity / Ticket / Category
  mongodb.ts                       # MongoClient singleton
  auth.ts                          # เซ็น/ตรวจ cookie session ของแอดมิน
  upload.ts                        # บันทึกไฟล์รูปลง public/uploads/
  db/
    activities.ts                  # CRUD กิจกรรมใน MongoDB
    tickets.ts                     # CRUD ticket ใน MongoDB
    categories.ts                  # CRUD หมวดหมู่ใน MongoDB
scripts/
  seed.mjs                         # สคริปต์ seed ข้อมูลตัวอย่าง + สร้าง index
public/
  images/                          # รูปตัวอย่างเดิม (placeholder)
  uploads/                         # รูปที่อัปโหลดจริงจากฟอร์ม/แอดมิน (gitignored)
```

## ความปลอดภัยเบื้องต้น (และสิ่งที่ควรทำต่อก่อนขึ้น production จริง)

- ระบบ login แอดมินเป็นแบบง่าย: username/password เดียวเก็บใน env + cookie เซ็นด้วย HMAC (ไม่ได้ใช้ next-auth หรือระบบผู้ใช้หลายคน) เหมาะกับการใช้งานภายในทีมเล็กๆ ถ้าต้องการแอดมินหลายคนหรือสิทธิ์หลายระดับ ควรทำระบบผู้ใช้แยกใน MongoDB
- หน้าตรวจสอบสถานะ (`/track`) ต้องรู้ทั้งรหัสติดตามและเบอร์โทรที่ใช้แจ้ง ถึงจะดูข้อมูลได้ — เป็นการป้องกันแบบพื้นฐาน ไม่ใช่ระบบยืนยันตัวตนที่รัดกุม
- ไฟล์ที่อัปโหลดไม่ได้สแกนไวรัส/มัลแวร์ และเก็บบน local filesystem ตรงๆ — ถ้าจะเปิดให้สาธารณะใช้งานจริงควรใส่ rate limiting, antivirus scan, และย้ายไป object storage
- ควรเปลี่ยน `ADMIN_PASSWORD` และ `SESSION_SECRET` ก่อนใช้งานจริงเสมอ

## ขั้นตอนถัดไปที่แนะนำ
- เพิ่มระบบแจ้งเตือน (อีเมล/LINE Notify) เมื่อมี ticket ใหม่เข้ามา หรือเมื่อสถานะเปลี่ยน
- เพิ่ม pagination ในหน้า `/admin/tickets` เมื่อข้อมูลเยอะขึ้น
- ย้ายการอัปโหลดรูปไป cloud storage เมื่อ deploy จริง
- เพิ่มระบบผู้ใช้แอดมินหลายคน พร้อมสิทธิ์การเข้าถึงแยกระดับ
