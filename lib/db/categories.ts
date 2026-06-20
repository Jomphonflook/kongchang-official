import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Category } from "@/lib/types";

interface CategoryDoc {
  _id?: ObjectId;
  name: string;
  createdAt: Date;
}

const DEFAULT_CATEGORIES = ["แจ้งเรื่อง", "ข่าวสาร"];

async function categoriesCollection(): Promise<Collection<CategoryDoc>> {
  const db = await getDb();
  return db.collection<CategoryDoc>("categories");
}

function toCategory(doc: CategoryDoc): Category {
  return {
    id: doc._id!.toString(),
    name: doc.name,
    createdAt: doc.createdAt?.toISOString(),
  };
}

// Bootstraps the default categories the first time this is called against an
// empty collection, so the report form has options even before `npm run seed`.
export async function getAllCategories(): Promise<Category[]> {
  const col = await categoriesCollection();
  const count = await col.countDocuments();
  if (count === 0) {
    const now = new Date();
    await col.insertMany(
      DEFAULT_CATEGORIES.map((name) => ({ name, createdAt: now }))
    );
  }
  const docs = await col.find({}).sort({ name: 1 }).toArray();
  return docs.map(toCategory);
}

export async function createCategory(name: string): Promise<Category> {
  const col = await categoriesCollection();
  const trimmed = name.trim();
  const existing = await col.findOne({ name: trimmed });
  if (existing) return toCategory(existing);
  const doc: CategoryDoc = { name: trimmed, createdAt: new Date() };
  const result = await col.insertOne(doc);
  return toCategory({ ...doc, _id: result.insertedId });
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await categoriesCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
