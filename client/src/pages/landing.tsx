import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Search,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import logoImage from "@assets/logo-64_1768327929037.png";

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

  const stats = [
    { value: "10+", label: "AI Platforms Tracked" },
    { value: "50K+", label: "Prompts Analyzed" },
    { value: "85%", label: "Avg. Visibility Improvement" },
    { value: "3x", label: "Faster Insights" },
  ];

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="AIO Mapper" className="h-8 w-8" />
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
            <Button variant="ghost" onClick={handleLogin} data-testid="button-login">
              Log In
            </Button>
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
              <Button size="lg" className="gap-2" onClick={handleLogin} data-testid="button-hero-start-trial">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link href="/app?demo=true">
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
              <div key={i} className="text-center" data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
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
              <Card key={i} className="hover-elevate" data-testid={`feature-card-${i}`}>
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
          <Button
            size="lg"
            variant="secondary"
            className="gap-2"
            onClick={handleLogin}
            data-testid="button-cta-start-free"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="AIO Mapper" className="h-6 w-6" />
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
