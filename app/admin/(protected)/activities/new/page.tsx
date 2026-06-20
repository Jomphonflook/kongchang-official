import ActivityForm from "@/components/admin/ActivityForm";

export default function NewActivityPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">เพิ่มกิจกรรมใหม่</h1>
      <div className="mt-8">
        <ActivityForm />
      </div>
    </div>
  );
}
