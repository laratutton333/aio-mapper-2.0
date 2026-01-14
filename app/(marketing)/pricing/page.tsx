import Link from "next/link";

type PricingTier = {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  highlights: string[];
  features: string[];
  cta: { label: string; href: string; variant: "primary" | "secondary" | "outline" };
  emphasized?: boolean;
  badge?: string;
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M9.1 9a3 3 0 1 1 4.8 2.4c-.9.7-1.6 1.2-1.6 2.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M12 17h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TierButton({
  href,
  variant,
  children
}: {
  href: string;
  variant: PricingTier["cta"]["variant"];
  children: React.ReactNode;
}) {
  const className =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-500"
      : variant === "outline"
        ? "border border-slate-800 bg-slate-950/40 text-slate-200 hover:bg-slate-900"
        : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <Link
      href={href}
      className={[
        "mt-6 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium transition-colors",
        className
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div
      className={[
        "relative flex h-full flex-col rounded-2xl border bg-slate-950 p-6 shadow-sm shadow-black/20",
        tier.emphasized
          ? "border-blue-600/70 ring-1 ring-blue-600/50"
          : "border-slate-800"
      ].join(" ")}
    >
      {tier.badge ? (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white">
          {tier.badge}
        </div>
      ) : null}

      <div className="text-sm font-semibold text-slate-100">{tier.name}</div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="text-3xl font-semibold tracking-tight text-white">{tier.price}</div>
        {tier.cadence ? <div className="text-sm text-slate-400">{tier.cadence}</div> : null}
      </div>
      <p className="mt-3 text-sm text-slate-300">{tier.description}</p>

      <div className="mt-5 space-y-2 text-sm text-slate-300">
        {tier.highlights.map((item) => (
          <div key={item}>
            <span className="font-semibold text-slate-100">{item.split(" ")[0]}</span>{" "}
            <span className="text-slate-400">{item.slice(item.split(" ")[0].length + 1)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 text-sm">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2 text-slate-200">
            <div className="mt-0.5 text-blue-500">
              <CheckIcon />
            </div>
            <div className="text-slate-300">{feature}</div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <TierButton href={tier.cta.href} variant={tier.cta.variant}>
          {tier.cta.label}
        </TierButton>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group border-b border-slate-800 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm text-slate-200">
        <span>{question}</span>
        <span className="shrink-0 text-slate-500 transition-transform group-open:rotate-180">
          <ChevronIcon />
        </span>
      </summary>
      <div className="mt-3 text-sm leading-relaxed text-slate-300">{answer}</div>
    </details>
  );
}

export default function PricingPage() {
  const tiers: PricingTier[] = [
    {
      name: "Free",
      price: "$0",
      description: "Try AIO Mapper with 10 free credits to explore your AI visibility.",
      highlights: ["10 credits", "1 brand"],
      features: [
        "AI visibility scoring",
        "Basic brand detection",
        "3 competitor tracking",
        "Summary reports",
        "Community support"
      ],
      cta: { label: "Get Started Free", href: "/dashboard", variant: "outline" }
    },
    {
      name: "Starter",
      price: "$99",
      cadence: "/month",
      description: "Perfect for freelancers and small businesses testing AI visibility.",
      highlights: ["50 credits", "1 brand"],
      features: [
        "Everything in Free",
        "5 competitor tracking",
        "Weekly reports",
        "Email support"
      ],
      cta: { label: "Get Started", href: "/dashboard", variant: "secondary" }
    },
    {
      name: "Pro",
      price: "$299",
      cadence: "/month",
      description: "For growing brands and consultants who need comprehensive insights.",
      highlights: ["200 credits", "3 brands"],
      features: [
        "Everything in Starter",
        "Advanced citation mapping",
        "15 competitor tracking",
        "Daily reports",
        "Priority support",
        "Custom prompts",
        "API access"
      ],
      emphasized: true,
      badge: "Most Popular",
      cta: { label: "Get Started", href: "/dashboard", variant: "primary" }
    },
    {
      name: "Business",
      price: "$599",
      cadence: "/month",
      description: "For agencies and mid-market companies with multiple brands.",
      highlights: ["600 credits", "10 brands"],
      features: [
        "Everything in Pro",
        "Unlimited competitors",
        "Real-time monitoring",
        "Custom integrations",
        "Dedicated account manager",
        "White-label reports",
        "Team collaboration"
      ],
      cta: { label: "Get Started", href: "/dashboard", variant: "secondary" }
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For Fortune 500 companies with enterprise-scale needs.",
      highlights: ["Unlimited credits", "Unlimited brands"],
      features: [
        "Everything in Business",
        "Custom AI model training",
        "SOC 2 compliance",
        "SSO/SAML",
        "Dedicated infrastructure",
        "SLA guarantee",
        "On-premise option"
      ],
      cta: { label: "Contact Sales", href: "/contact", variant: "outline" }
    }
  ];

  const faqs = [
    {
      q: "What counts as a credit?",
      a: "A credit is a single query we send to AI systems on your behalf. Each query generates a complete analysis including brand detection, citation mapping, and visibility scoring."
    },
    {
      q: "What do I get with the free plan?",
      a: "You get 10 free credits to explore AIO Mapper. This includes AI visibility scoring, basic brand detection, and tracking up to 3 competitors. No credit card required."
    },
    {
      q: "Can I upgrade or downgrade my plan?",
      a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle. Unused credits don't carry over."
    },
    {
      q: "What AI systems do you analyze?",
      a: "We currently analyze responses from ChatGPT, Perplexity, Claude, and Google's AI overviews. We're constantly adding new AI platforms."
    },
    {
      q: "How often are results updated?",
      a: "Depending on your plan, results are updated weekly (Starter), daily (Pro), or in real-time (Business and Enterprise)."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[380px] w-[760px] -translate-x-1/2 rounded-full bg-blue-600/12 blur-3xl" />
        <div className="absolute -top-10 left-1/2 h-[240px] w-[520px] -translate-x-1/2 rounded-full bg-slate-700/25 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 text-center sm:pt-20">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
          Start with 10 free credits. No credit card required.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-900/80 bg-slate-950/40">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-800 bg-slate-950 text-blue-500">
            <HelpIcon />
          </div>
          <h2 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 text-left">
            {faqs.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/80">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-800 bg-slate-950/40 px-5 text-sm font-medium text-slate-200 hover:bg-slate-900"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

