// lib/stripe.ts
// Stripe client for payments and subscriptions

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

/**
 * Create a Stripe customer for an organization
 */
export async function createStripeCustomer(
  organizationId: string,
  email: string,
  name: string
): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      organizationId,
    },
  });
  return customer.id;
}

/**
 * Create a subscription for an organization
 */
export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<string> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [
      {
        price: priceId,
      },
    ],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });
  return subscription.id;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<void> {
  await stripe.subscriptions.del(subscriptionId);
}
