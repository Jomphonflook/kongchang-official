import { getAllCategories } from "@/lib/db/categories";
import AddCategoryForm from "@/components/admin/AddCategoryForm";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink">หมวดหมู่</h1>
      <p className="mt-2 text-sm text-muted">
        หมวดหมู่เหล่านี้จะปรากฏในแบบฟอร์ม “แจ้งเรื่อง / ข่าวสาร” ของผู้ใช้ทั่วไป
      </p>

      <ul className="mt-8 divide-y divide-line/10 border border-line/15">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between p-4">
            <span className="text-ink">{c.name}</span>
            <DeleteCategoryButton categoryId={c.id} name={c.name} />
          </li>
        ))}
        {categories.length === 0 && (
          <li className="p-4 text-sm text-muted">ยังไม่มีหมวดหมู่</li>
        )}
      </ul>

      <div className="mt-8">
        <AddCategoryForm />
      </div>
    </div>
  );
}
