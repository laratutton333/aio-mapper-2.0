import Link from "next/link";

function FeatureIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
      {children}
    </div>
  );
}

function IconSpark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2l1.3 6.2L20 9.5l-5.2 3 1.3 6.2L13 15.7 7.9 18.7l1.3-6.2L4 9.5l5.7-1.3L11 2h2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 1 9-9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 17a5 5 0 1 1 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 19V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 19h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 15v-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 15V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 15v-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 2L3 14h8l-1 8 11-14h-8l0-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MarketingHomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -top-10 left-1/2 h-[260px] w-[520px] -translate-x-1/2 rounded-full bg-slate-700/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 pb-12 pt-16 text-center sm:pt-20">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-200">
          <IconSpark />
          <span>AI Search Intelligence Platform</span>
        </div>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Master Your Brand&apos;s{" "}
          <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            AI Visibility
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Measure, explain, and improve how your brand appears across AI search engines. Get
          transparent scoring and actionable insights to dominate generative search results.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            Get 10 Free Credits →
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-950/40 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-900"
          >
            View Live Demo
          </Link>
        </div>

        <div className="mt-12 grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {[
            { value: "85%", label: "Average visibility improvement" },
            { value: "500+", label: "Brands tracked" },
            { value: "10K+", label: "Prompts analyzed daily" },
            { value: "4.9/5", label: "Customer satisfaction" }
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold text-blue-400">{stat.value}</div>
              <div className="mt-1 text-xs text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-900/80 bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Complete AI Visibility Suite
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              Everything you need to understand and optimize your brand&apos;s presence in
              AI-generated answers.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Query Simulation",
                description:
                  "Simulate real user prompts across AI systems like ChatGPT and Perplexity to understand how your brand appears.",
                icon: <IconSearch />
              },
              {
                title: "Brand Detection",
                description:
                  "Identify explicit mentions, implied references, and brand variants in AI-generated responses.",
                icon: <IconTarget />
              },
              {
                title: "Citation Mapping",
                description:
                  "Track which URLs AI models rely on and identify gaps in your brand's authority.",
                icon: <IconLink />
              },
              {
                title: "Transparent Scoring",
                description:
                  "Get explainable visibility scores with sub-metrics for presence, citations, and recommendations.",
                icon: <IconChart />
              },
              {
                title: "Competitive Analysis",
                description:
                  "Compare your visibility against competitors with side-by-side prompt-level breakdowns.",
                icon: <IconChart />
              },
              {
                title: "Actionable Insights",
                description:
                  "Receive prioritized recommendations for content gaps, authority building, and visibility improvements.",
                icon: <IconBolt />
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-sm shadow-black/20 transition-colors hover:border-slate-700 hover:bg-slate-900/40"
              >
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <div className="mt-4 text-sm font-semibold">{feature.title}</div>
                <div className="mt-2 text-sm text-slate-300">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/80">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How It Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              Get started in minutes with our straightforward process.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Connect Your Brand",
                description:
                  "Add your brand domain and industry to start tracking your AI presence."
              },
              {
                step: "02",
                title: "Run AI Simulations",
                description:
                  "We query AI systems with industry-relevant prompts to measure your visibility."
              },
              {
                step: "03",
                title: "Analyze Results",
                description:
                  "Review comprehensive metrics showing where and how your brand appears."
              },
              {
                step: "04",
                title: "Optimize & Grow",
                description:
                  "Follow actionable recommendations to improve your AI search presence."
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-blue-700/60 bg-slate-950 text-sm font-semibold text-blue-400">
                  {item.step}
                </div>
                <div className="mt-4 text-sm font-semibold">{item.title}</div>
                <div className="mt-2 text-sm text-slate-300">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/80 bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Why Choose AIO Mapper?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              Unlike traditional SEO tools, we&apos;re built specifically for the age of AI search.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Full Explainability",
                description:
                  "Every metric is traceable to specific prompts, answers, and evidence. No black-box scores."
              },
              {
                title: "Transparent Scoring",
                description:
                  "See all sub-scores individually: presence rate, citation rate, recommendation rate, and more."
              },
              {
                title: "Page-Level Fixes",
                description:
                  "Get specific content recommendations at the page level, not just vague topic suggestions."
              }
            ].map((reason) => (
              <div
                key={reason.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition-colors hover:border-slate-700 hover:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-blue-400">{reason.title}</div>
                <div className="mt-2 text-sm text-slate-300">{reason.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/80 bg-blue-600">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to Dominate AI Search?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100">
            Get started with 10 free credits and discover how your brand appears in AI-generated
            answers.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md bg-slate-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-900"
            >
              Get Started Free →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
