import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Activity } from "@/lib/types";

interface ActivityDoc {
  _id?: ObjectId;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  cover: string;
  gallery: string[];
  summary: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

async function activitiesCollection(): Promise<Collection<ActivityDoc>> {
  const db = await getDb();
  return db.collection<ActivityDoc>("activities");
}

function toActivity(doc: ActivityDoc): Activity {
  return {
    id: doc._id!.toString(),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    date: doc.date,
    location: doc.location,
    cover: doc.cover,
    gallery: doc.gallery ?? [],
    summary: doc.summary,
    description: doc.description,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

// function slugify(title: string): string {
//   const base = title
//     .toString()
//     .trim()
//     .toLowerCase()
//     .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, "-")
//     .replace(/^-+|-+$/g, "");
//   return base || `activity-${Date.now()}`;
// }

export async function getAllActivities(): Promise<Activity[]> {
  const col = await activitiesCollection();
  const docs = await col.find({}).sort({ date: -1 }).toArray();
  return docs.map(toActivity);
}

export async function getActivityById(id: string): Promise<Activity | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await activitiesCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toActivity(doc) : null;
}

export interface ActivityInput {
  title: string;
  category: string;
  date: string;
  location: string;
  cover: string;
  gallery: string[];
  summary: string;
  description: string;
  slug?: string;
}

export async function createActivity(input: ActivityInput): Promise<Activity> {
  const col = await activitiesCollection();
  // const base = slugify(input.slug || input.title);
  // let candidate = base;
  // let i = 1;
  // // eslint-disable-next-line no-await-in-loop
  // while (await col.findOne({ slug: candidate })) {
  //   candidate = `${base}-${i++}`;
  // }
  const now = new Date();
  const doc: ActivityDoc = {
    slug: input.slug || '',
    title: input.title,
    category: input.category,
    date: input.date,
    location: input.location,
    cover: input.cover,
    gallery: input.gallery,
    summary: input.summary,
    description: input.description,
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc);
  return toActivity({ ...doc, _id: result.insertedId });
}

export type ActivityUpdateInput = Partial<Omit<ActivityInput, "slug">>;

export async function updateActivity(
  id: string,
  input: ActivityUpdateInput
): Promise<Activity | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await activitiesCollection();
  const _id = new ObjectId(id);
  const update: Partial<ActivityDoc> = { ...input, updatedAt: new Date() };
  await col.updateOne({ _id }, { $set: update });
  const doc = await col.findOne({ _id });
  return doc ? toActivity(doc) : null;
}

export async function deleteActivity(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await activitiesCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}
