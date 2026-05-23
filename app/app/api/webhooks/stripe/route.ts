// app/api/webhooks/stripe/route.ts
// Stripe webhook handler for subscription events

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// Convert req to a Node.js Readable stream if needed
async function getRawBody(readable: ReadableStream<Uint8Array>) {
  const reader = readable.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((v) => Buffer.from(v)));
}

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events (subscription changes, payments, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await getRawBody(request.body!);
    const sig = request.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle specific event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as any;

        // Update organization subscription
        await prisma.organization.updateMany({
          where: {
            stripeCustomerId: subscription.customer,
          },
          data: {
            stripeSubscriptionId: subscription.id,
            planExpiresAt: new Date(subscription.current_period_end * 1000),
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;

        // Cancel organization subscription
        await prisma.organization.updateMany({
          where: {
            stripeCustomerId: subscription.customer,
          },
          data: {
            stripeSubscriptionId: null,
            plan: "FREE",
          },
        });

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;

        // Log successful payment
        console.log(`Payment succeeded for customer: ${invoice.customer}`);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
