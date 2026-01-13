import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  BarChart3,
  Search,
  TrendingUp,
  Shield,
  Zap,
  Target,
  LineChart,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Search,
      title: "AI Search Monitoring",
      description:
        "Track how your brand appears in ChatGPT, Perplexity, Google AI Overviews, and other AI search engines.",
    },
    {
      icon: BarChart3,
      title: "Visibility Scoring",
      description:
        "Get transparent, explainable metrics that show exactly where your brand stands in AI-generated answers.",
    },
    {
      icon: TrendingUp,
      title: "Competitive Intelligence",
      description:
        "Compare your AI visibility against competitors and identify opportunities to improve your positioning.",
    },
    {
      icon: Target,
      title: "Citation Tracking",
      description:
        "See which sources AI models cite when mentioning your brand and optimize for better attribution.",
    },
    {
      icon: Zap,
      title: "Actionable Recommendations",
      description:
        "Get prioritized suggestions to improve your brand's presence in AI-generated content.",
    },
    {
      icon: Shield,
      title: "Brand Protection",
      description:
        "Monitor for misrepresentation and ensure AI models accurately represent your brand.",
    },
  ];

  const testimonials = [
    {
      quote:
        "AIO Mapper helped us understand why we were invisible in AI search. Within 3 months, our visibility score jumped 40%.",
      author: "Sarah Chen",
      role: "VP of Marketing",
      company: "TechScale Inc.",
    },
    {
      quote:
        "The competitive analysis is invaluable. We now know exactly where our competitors are winning in AI answers.",
      author: "Michael Torres",
      role: "Head of SEO",
      company: "GrowthLabs",
    },
    {
      quote:
        "Finally, a tool that explains AI visibility in terms we can actually act on. The ROI has been incredible.",
      author: "Emily Watson",
      role: "CMO",
      company: "Nexus Digital",
    },
  ];

  const stats = [
    { value: "10+", label: "AI Platforms Tracked" },
    { value: "50K+", label: "Prompts Analyzed" },
    { value: "85%", label: "Avg. Visibility Improvement" },
    { value: "3x", label: "Faster Insights" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <LineChart className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">AIO Mapper</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-nav-pricing">
                Pricing
              </span>
            </Link>
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-nav-terms">
                Terms
              </span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-nav-privacy">
                Privacy
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" data-testid="button-login">
                Log In
              </Button>
            </Link>
            <Link href="/pricing">
              <Button data-testid="button-get-started">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              AI Search Visibility Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Measure Your Brand's Visibility in{" "}
              <span className="text-primary">AI Answers</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Understand how AI search engines like ChatGPT, Perplexity, and
              Google AI Overviews represent your brand. Get transparent metrics
              and actionable recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="gap-2" data-testid="button-hero-start-trial">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" data-testid="button-hero-view-demo">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need for AI Visibility
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to monitor, analyze, and improve how AI
              models represent your brand.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get actionable AI visibility insights in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Add Your Brand",
                description:
                  "Enter your brand name, domain, and key competitors to start tracking.",
              },
              {
                step: "2",
                title: "Run AI Audits",
                description:
                  "We query AI search engines with industry-relevant prompts to measure visibility.",
              },
              {
                step: "3",
                title: "Get Insights",
                description:
                  "Review your visibility scores, citations, and prioritized recommendations.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Trusted by Marketing Teams
            </h2>
            <p className="text-muted-foreground">
              See what our customers say about AIO Mapper.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Own Your AI Visibility?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Start your free trial today and discover how AI search engines see
            your brand.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2"
              data-testid="button-cta-start-free"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span className="font-semibold">AIO Mapper</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/pricing">
                <span className="hover:text-foreground cursor-pointer">Pricing</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
              </Link>
              <Link href="/privacy">
                <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">
              2026 AIO Mapper. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
