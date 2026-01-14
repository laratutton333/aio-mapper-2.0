export function buildDemoUser() {
  const timestamp = new Date().toISOString();

  return {
    id: "demo-user-1",
    email: "demo@example.com",
    firstName: "John",
    lastName: "Doe",
    profileImageUrl: null,
    stripeCustomerId: null,
    stripeSubscriptionId: "sub_demo_enterprise",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
