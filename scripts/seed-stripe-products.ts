import { getUncachableStripeClient } from '../server/stripeClient';

async function createProducts() {
  console.log('Creating Stripe products and prices...');
  
  const stripe = await getUncachableStripeClient();

  // Check if products already exist
  const existingProducts = await stripe.products.search({ query: "name:'Starter'" });
  if (existingProducts.data.length > 0) {
    console.log('Products already exist, skipping creation');
    return;
  }

  // Starter Plan - Free tier
  const starterProduct = await stripe.products.create({
    name: 'Starter',
    description: 'Perfect for trying out AIO Mapper',
    metadata: {
      tier: 'starter',
      promptsPerMonth: '20',
      features: 'Basic visibility score,Single brand tracking,Email support'
    }
  });
  console.log('Created Starter product:', starterProduct.id);

  const starterPrice = await stripe.prices.create({
    product: starterProduct.id,
    unit_amount: 0,
    currency: 'usd',
    recurring: { interval: 'month' },
  });
  console.log('Created Starter price:', starterPrice.id);

  // Pro Plan
  const proProduct = await stripe.products.create({
    name: 'Pro',
    description: 'For growing brands serious about AI visibility',
    metadata: {
      tier: 'pro',
      promptsPerMonth: '500',
      features: 'Full visibility analytics,Up to 5 competitors,Citation tracking,Priority support'
    }
  });
  console.log('Created Pro product:', proProduct.id);

  const proMonthlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 4900, // $49/month
    currency: 'usd',
    recurring: { interval: 'month' },
  });
  console.log('Created Pro monthly price:', proMonthlyPrice.id);

  const proYearlyPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 47000, // $470/year (2 months free)
    currency: 'usd',
    recurring: { interval: 'year' },
  });
  console.log('Created Pro yearly price:', proYearlyPrice.id);

  // Enterprise Plan
  const enterpriseProduct = await stripe.products.create({
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    metadata: {
      tier: 'enterprise',
      promptsPerMonth: 'unlimited',
      features: 'Unlimited prompts,Unlimited competitors,Custom integrations,Dedicated account manager,SLA guarantee'
    }
  });
  console.log('Created Enterprise product:', enterpriseProduct.id);

  const enterpriseMonthlyPrice = await stripe.prices.create({
    product: enterpriseProduct.id,
    unit_amount: 19900, // $199/month
    currency: 'usd',
    recurring: { interval: 'month' },
  });
  console.log('Created Enterprise monthly price:', enterpriseMonthlyPrice.id);

  const enterpriseYearlyPrice = await stripe.prices.create({
    product: enterpriseProduct.id,
    unit_amount: 190000, // $1900/year (2 months free)
    currency: 'usd',
    recurring: { interval: 'year' },
  });
  console.log('Created Enterprise yearly price:', enterpriseYearlyPrice.id);

  console.log('All products and prices created successfully!');
}

createProducts().catch(console.error);
