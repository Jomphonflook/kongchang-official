import { notFound } from "next/navigation";
import { getActivityById } from "@/lib/db/activities";
import ActivityForm from "@/components/admin/ActivityForm";

export const dynamic = "force-dynamic";

export default async function EditActivityPage({
  params,
}: {
  params: { id: string };
}) {
  const activity = await getActivityById(params.id);
  if (!activity) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">แก้ไขกิจกรรม</h1>
      <div className="mt-8">
        <ActivityForm activity={activity} />
      </div>
    </div>
  );
}
