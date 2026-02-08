import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongo";
import type { BookingPayload } from "@/types/parking";

export async function GET() {
  try {
    const db = await getDb();
    const items = await db.collection("bookings").find().sort({ _id: -1 }).limit(20).toArray();
    return NextResponse.json({ bookings: items }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Unable to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingPayload;
    if (!payload || !payload.parkingId || !payload.totalAmount || !payload.currency) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const db = await getDb();
    const result = await db.collection("bookings").insertOne({
      ...payload,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Unable to create booking" }, { status: 500 });
  }
}
