import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Check, ArrowLeft } from "lucide-react";
import logoImage from "@assets/logo-64_1768327929037.png";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for freelancers and small businesses testing AI visibility.",
      prompts: "50",
      brands: "1",
      features: [
        "50 prompts per month",
        "1 brand tracking",
        "4 AI platforms monitored",
        "Weekly visibility reports",
        "Basic recommendations",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
      isEnterprise: false,
    },
    {
      name: "Pro",
      price: "$299",
      period: "/month",
      description: "For growing brands serious about AI search optimization.",
      prompts: "200",
      brands: "3",
      features: [
        "200 prompts per month",
        "3 brands tracking",
        "8 AI platforms monitored",
        "Daily visibility reports",
        "Competitor comparison",
        "Citation analysis",
        "Priority recommendations",
        "Priority email support",
      ],
      cta: "Start Free Trial",
      popular: true,
      isEnterprise: false,
    },
    {
      name: "Business",
      price: "$599",
      period: "/month",
      description: "For agencies and multi-brand companies needing scale.",
      prompts: "600",
      brands: "10",
      features: [
        "600 prompts per month",
        "10 brands tracking",
        "All AI platforms monitored",
        "Real-time monitoring",
        "Advanced competitor analysis",
        "White-label reports",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      cta: "Start Free Trial",
      popular: false,
      isEnterprise: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For Fortune 500 brands requiring unlimited scale and support.",
      prompts: "Unlimited",
      brands: "Unlimited",
      features: [
        "Unlimited prompts",
        "Unlimited brands",
        "All AI platforms + custom",
        "Real-time alerts",
        "SSO & SAML authentication",
        "SOC 2 compliance",
        "Custom SLAs",
        "Dedicated success team",
        "On-premise deployment option",
      ],
      cta: "Contact Sales",
      popular: false,
      isEnterprise: true,
    },
  ];

  const faqs = [
    {
      question: "What's included in the free trial?",
      answer: "Every paid plan includes 20 free prompts to test the platform. No credit card required to start. Use your trial prompts to see real visibility data for your brand.",
    },
    {
      question: "Which AI platforms do you monitor?",
      answer: "We track ChatGPT, Perplexity, Google AI Overviews, Microsoft Copilot, Claude, Gemini, and more. Enterprise plans can add custom AI platforms.",
    },
    {
      question: "What counts as a 'prompt'?",
      answer: "A prompt is a single query we run against an AI platform. For example, 'What are the best project management tools?' is one prompt.",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle.",
    },
    {
      question: "Do you offer annual pricing?",
      answer: "Yes! Annual plans receive a 20% discount. Contact us for annual billing options.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, ACH transfers, and wire transfers for Enterprise plans.",
    },
  ];

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const handlePlanClick = (isEnterprise: boolean) => {
    if (isEnterprise) {
      window.location.href = "mailto:sales@aiomapper.com?subject=Enterprise%20Inquiry";
    } else {
      window.location.href = "/signup";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src={logoImage} alt="AIO Mapper" className="h-8 w-8" />
              <span className="text-xl font-semibold">AIO Mapper</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={handleLogin} data-testid="button-pricing-login">
              Log In
            </Button>
            <Link href="/app?demo=true">
              <Button data-testid="button-pricing-demo">View Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start with a free trial on any plan.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <Card
                key={i}
                className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}
                data-testid={`pricing-card-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">{plan.prompts}</Badge>
                      <span className="text-muted-foreground">prompts/month</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary">{plan.brands}</Badge>
                      <span className="text-muted-foreground">brands</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan.isEnterprise)}
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison callout */}
      <section className="py-12 bg-muted/30 border-y">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">How We Compare</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            AIO Mapper offers premium AI visibility insights at a fraction of enterprise tool pricing.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-muted-foreground line-through">$499/mo</div>
                <div className="text-sm text-muted-foreground">Profound Lite</div>
              </CardContent>
            </Card>
            <Card className="border-primary">
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-primary">$299/mo</div>
                <div className="text-sm font-medium">AIO Mapper Pro</div>
                <Badge className="mt-2">Save 40%</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-muted-foreground">$29/mo</div>
                <div className="text-sm text-muted-foreground">Otterly Lite (15 prompts)</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <Card key={i} data-testid={`faq-card-${i}`}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2" data-testid={`faq-question-${i}`}>{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/80 mb-8">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" onClick={handleLogin} data-testid="button-cta-trial">
              Start Free Trial
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="AIO Mapper" className="h-6 w-6" />
              <span className="font-semibold">AIO Mapper</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms">
                <span className="hover:text-foreground cursor-pointer">Terms</span>
              </Link>
              <Link href="/privacy">
                <span className="hover:text-foreground cursor-pointer">Privacy</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
