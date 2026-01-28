import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { BookingPayload } from "@/types/parking";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-12-15.clover",
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as BookingPayload;
    if (!payload || !payload.totalAmount || !payload.currency) {
      return NextResponse.json(
        { error: "Invalid booking payload." },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

    if (!origin) {
      return NextResponse.json(
        { error: "Unable to determine application URL." },
        { status: 500 }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { url: `${origin}/success?mock=1` },
        { status: 200 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: payload.currency,
            product_data: {
              name: `Parking at ${payload.parkingName}`,
              description: `${payload.city}, ${payload.country} · Arrival ${payload.arrivalTime}`,
            },
            unit_amount: Math.round(payload.totalAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        parkingId: payload.parkingId,
        arrivalTime: payload.arrivalTime,
        durationHours: String(payload.durationHours),
        baseAmount: String(payload.baseAmount),
        lateFeeAmount: String(payload.lateFeeAmount),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ url: session.url }, { status: 201 });
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Unable to create Stripe Checkout session." },
      { status: 500 }
    );
  }
}
