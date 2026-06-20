import crypto from "crypto";
import { Collection, Filter, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { Ticket, TicketStatus } from "@/lib/types";

interface TicketDoc {
  _id?: ObjectId;
  code: string;
  title: string;
  description: string;
  category: string;
  name: string;
  phone: string;
  images: string[];
  status: TicketStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

async function ticketsCollection(): Promise<Collection<TicketDoc>> {
  const db = await getDb();
  return db.collection<TicketDoc>("tickets");
}

function toTicket(doc: TicketDoc): Ticket {
  return {
    id: doc._id!.toString(),
    code: doc.code,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    name: doc.name,
    phone: doc.phone,
    images: doc.images ?? [],
    status: doc.status,
    adminNote: doc.adminNote,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function generateCode(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `TK-${stamp}-${rand}`;
}

export interface TicketInput {
  title: string;
  description: string;
  category: string;
  name: string;
  phone: string;
  images: string[];
}

export async function createTicket(input: TicketInput): Promise<Ticket> {
  const col = await ticketsCollection();
  const now = new Date();
  const doc: TicketDoc = {
    code: generateCode(),
    title: input.title,
    description: input.description,
    category: input.category,
    name: input.name,
    phone: input.phone,
    images: input.images,
    status: "open",
    createdAt: now,
    updatedAt: now,
  };
  const result = await col.insertOne(doc);
  return toTicket({ ...doc, _id: result.insertedId });
}

export async function getTickets(
  filter: { status?: string; category?: string } = {}
): Promise<Ticket[]> {
  const col = await ticketsCollection();
  const query: Filter<TicketDoc> = {};
  if (filter.status) query.status = filter.status as TicketStatus;
  if (filter.category) query.category = filter.category;
  const docs = await col.find(query).sort({ createdAt: -1 }).toArray();
  return docs.map(toTicket);
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await ticketsCollection();
  const doc = await col.findOne({ _id: new ObjectId(id) });
  return doc ? toTicket(doc) : null;
}

// Public tracking lookup: requires both the code AND the phone number used
// when filing the ticket, so a guessed/leaked id alone isn't enough.
export async function getTicketByCodeAndPhone(
  code: string,
  phone: string
): Promise<Ticket | null> {
  const col = await ticketsCollection();
  const doc = await col.findOne({
    code: code.trim().toUpperCase(),
    phone: phone.trim(),
  });
  return doc ? toTicket(doc) : null;
}

export async function updateTicket(
  id: string,
  input: { status?: TicketStatus; adminNote?: string }
): Promise<Ticket | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await ticketsCollection();
  const _id = new ObjectId(id);
  const update: Partial<TicketDoc> = { updatedAt: new Date() };
  if (input.status) update.status = input.status;
  if (input.adminNote !== undefined) update.adminNote = input.adminNote;
  await col.updateOne({ _id }, { $set: update });
  const doc = await col.findOne({ _id });
  return doc ? toTicket(doc) : null;
}

export async function deleteTicket(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await ticketsCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

export async function getTicketStats(): Promise<Record<string, number>> {
  const col = await ticketsCollection();
  const agg = await col
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ])
    .toArray();
  const stats: Record<string, number> = {
    open: 0,
    in_progress: 0,
    done: 0,
    rejected: 0,
  };
  for (const row of agg) {
    stats[row._id] = row.count;
  }
  return stats;
}
