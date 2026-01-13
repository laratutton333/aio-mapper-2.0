import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    const stripe = await getUncachableStripeClient();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    await WebhookHandlers.handleStripeEvent(event);
  }

  static async handleStripeEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.customer && session.subscription) {
          const customerId = typeof session.customer === 'string' 
            ? session.customer 
            : session.customer.id;
          const subscriptionId = typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription.id;

          await db.update(users)
            .set({ stripeSubscriptionId: subscriptionId })
            .where(eq(users.stripeCustomerId, customerId));
          
          console.log(`Updated user subscription: customer=${customerId}, subscription=${subscriptionId}`);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id;

        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await db.update(users)
            .set({ stripeSubscriptionId: null })
            .where(eq(users.stripeCustomerId, customerId));
          
          console.log(`Cleared user subscription: customer=${customerId}`);
        } else {
          await db.update(users)
            .set({ stripeSubscriptionId: subscription.id })
            .where(eq(users.stripeCustomerId, customerId));
          
          console.log(`Updated user subscription: customer=${customerId}, subscription=${subscription.id}`);
        }
        break;
      }
    }
  }
}
