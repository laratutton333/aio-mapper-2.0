import Link from "next/link";

type Step = {
  step: string;
  title: string;
  description: string;
  bullets: string[];
  placeholder: string;
};

function StepIcon({ variant }: { variant: "search" | "spark" | "link" | "chart" | "compare" | "target" }) {
  const common = { stroke: "currentColor", strokeWidth: 1.8, fill: "none" as const };

  if (variant === "search") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
          {...common}
        />
        <path d="M16.5 16.5L21 21" {...common} strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "spark") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M13 2l1.3 6.2L20 9.5l-5.2 3 1.3 6.2L13 15.7 7.9 18.7l1.3-6.2L4 9.5l5.7-1.3L11 2h2z"
          {...common}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "link") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
          {...common}
          strokeLinecap="round"
        />
        <path
          d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
          {...common}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "chart") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 19V5" {...common} strokeLinecap="round" />
        <path d="M4 19h16" {...common} strokeLinecap="round" />
        <path d="M8 15v-4" {...common} strokeLinecap="round" />
        <path d="M12 15V8" {...common} strokeLinecap="round" />
        <path d="M16 15v-6" {...common} strokeLinecap="round" />
      </svg>
    );
  }

  if (variant === "compare") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 20V10" {...common} strokeLinecap="round" />
        <path d="M12 20V4" {...common} strokeLinecap="round" />
        <path d="M17 20v-7" {...common} strokeLinecap="round" />
        <path d="M4 20h16" {...common} strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 1 9-9"
        {...common}
        strokeLinecap="round"
      />
      <path
        d="M12 17a5 5 0 1 1 5-5"
        {...common}
        strokeLinecap="round"
      />
      <path d="M12 13a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="currentColor" />
    </svg>
  );
}

function StepBlock({
  item,
  align
}: {
  item: Step & { icon: React.ComponentProps<typeof StepIcon>["variant"] };
  align: "left" | "right";
}) {
  const isLeft = align === "left";

  return (
    <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
      <div className={isLeft ? "lg:col-span-6 lg:order-1" : "lg:col-span-6 lg:order-2"}>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs text-slate-300">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/15 text-blue-400">
            <StepIcon variant={item.icon} />
          </span>
          <span className="font-semibold text-slate-200">Step {item.step}</span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h2>
        <p className="mt-3 max-w-xl text-sm text-slate-300">{item.description}</p>

        <div className="mt-6 space-y-2">
          {item.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={isLeft ? "lg:col-span-6 lg:order-2" : "lg:col-span-6 lg:order-1"}>
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 to-slate-950/40 p-6 shadow-sm shadow-black/25">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-slate-800 bg-slate-950/40">
            <div className="text-xs text-slate-500">{item.placeholder}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const steps: Array<Step & { icon: React.ComponentProps<typeof StepIcon>["variant"] }> = [
    {
      step: "01",
      icon: "search",
      title: "AI Query Simulation",
      description:
        "We simulate thousands of real user prompts across ChatGPT, Perplexity, Claude, and other AI systems. Our prompt library covers informational, comparative, transactional, and authority-related queries specific to your industry.",
      bullets: [
        "Industry-specific prompt templates",
        "Custom query generation from your site taxonomy",
        "Multi-platform AI coverage",
        "Real-time answer capture"
      ],
      placeholder: "AI Query Simulation Visualization"
    },
    {
      step: "02",
      icon: "spark",
      title: "Brand & Entity Detection",
      description:
        "Our NLP engine analyzes each AI response to detect how and where your brand appears. We identify explicit mentions, implied references, and competitor visibility within each answer.",
      bullets: [
        "Primary vs. secondary detection",
        "Supporting mention classification",
        "Negative/ambiguous mention flags",
        "Confidence scoring per mention"
      ],
      placeholder: "Brand & Entity Detection Visualization"
    },
    {
      step: "03",
      icon: "link",
      title: "Citation & Source Mapping",
      description:
        "We extract and analyze the sources AI models cite, identifying which URLs drive your brand's visibility and where third-party content may be overshadowing your owned media.",
      bullets: [
        "URL extraction from cited sources",
        "Source type classification",
        "Brand-owned vs third-party analysis",
        "Authority dominance mapping"
      ],
      placeholder: "Citation & Source Mapping Visualization"
    },
    {
      step: "04",
      icon: "chart",
      title: "Transparent Visibility Scoring",
      description:
        "Your composite visibility score is built from explainable sub-metrics. Every number is traceable back to specific prompts and evidence — no black box scoring.",
      bullets: [
        "Presence rate: how often you appear",
        "Recommendation rate: how often you're suggested",
        "Citation rate: how often your content is cited",
        "Authority diversity: breadth of sources coverage"
      ],
      placeholder: "Transparent Visibility Scoring Visualization"
    },
    {
      step: "05",
      icon: "compare",
      title: "Competitive Benchmarking",
      description:
        "See how your visibility stacks up against competitors. Our side-by-side analysis reveals share of AI voice, prompt-level breakdowns, and trend deltas over time.",
      bullets: [
        "Share of AI answers by brand",
        "Prompt-level visibility comparisons",
        "Historical trend comparison",
        "Win/loss analysis per query type"
      ],
      placeholder: "Competitive Benchmarking Visualization"
    },
    {
      step: "06",
      icon: "target",
      title: "Prescriptive Recommendations",
      description:
        "Transform insights into action with prioritized recommendations. We identify specific content gaps, authority opportunities, and structural improvements ranked by impact and effort.",
      bullets: [
        "Missing page identification",
        "Weak explanation detection",
        "Third-party validation gaps",
        "Schema and structure recommendations"
      ],
      placeholder: "Prescriptive Recommendations Visualization"
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
          How AIO Mapper Works
        </h1>
        <p className="mx-auto mt-3 max-w-3xl text-sm text-slate-300">
          Our six-step process measures, explains, and improves your brand&apos;s visibility across
          AI search engines with full transparency and actionable insights.
        </p>
      </section>

      <section className="relative mx-auto max-w-6xl space-y-14 px-6 pb-16">
        {steps.map((item, index) => (
          <StepBlock key={item.step} item={item} align={index % 2 === 0 ? "left" : "right"} />
        ))}
      </section>

      <section className="border-t border-slate-900/80 bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Core Use Cases</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
              AIO Mapper helps you answer the questions that matter most.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Brand Discovery Audit",
                description:
                  "Is your brand mentioned for category-level prompts? Discover gaps in your AI presence."
              },
              {
                title: "Competitive AI Share of Voice",
                description:
                  "Who appears most often in AI answers? Track your position relative to competitors."
              },
              {
                title: "Citation & Source Analysis",
                description:
                  "Which URLs do AI models rely on? Understand the authority signals driving visibility."
              },
              {
                title: "Content Gap Detection",
                description:
                  "What questions do AI answers omit about your content? Find opportunities to fill the void."
              },
              {
                title: "Trend Tracking",
                description:
                  "How has visibility changed after content updates? Measure the impact of your optimizations."
              }
            ].map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition-colors hover:border-slate-700 hover:bg-slate-900/40"
              >
                <div className="text-sm font-semibold text-slate-100">{useCase.title}</div>
                <div className="mt-2 text-sm text-slate-300">{useCase.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-900/80">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl bg-blue-600 px-6 py-14 text-center text-white sm:px-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">See It In Action</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100">
              Experience the full power of AIO Mapper with our interactive demo. No signup required.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-medium text-white hover:bg-slate-900"
              >
                Try Live Demo →
              </Link>
              <Link
                href="/account"
                className="inline-flex h-10 items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 text-sm font-medium text-white hover:bg-white/15"
              >
                Get 10 Free Credits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
