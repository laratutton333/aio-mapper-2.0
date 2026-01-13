import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon, Monitor, Building2, Globe, Bell, Download } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your AIO Mapper preferences and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
          <CardDescription>
            Customize how AIO Mapper looks on your device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Theme</Label>
            <div className="flex gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTheme("light")}
                data-testid="button-theme-light"
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTheme("dark")}
                data-testid="button-theme-dark"
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setTheme("system")}
                data-testid="button-theme-system"
              >
                <Monitor className="h-4 w-4 mr-2" />
                System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Brand Configuration
          </CardTitle>
          <CardDescription>
            Configure your primary brand and variants for tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                placeholder="Enter your brand name"
                defaultValue="Acme Corp"
                data-testid="input-brand-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary-domain">Primary Domain</Label>
              <Input
                id="primary-domain"
                placeholder="example.com"
                defaultValue="acmecorp.com"
                data-testid="input-primary-domain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Brand Variants</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Acme</Badge>
              <Badge variant="secondary">Acme Corp</Badge>
              <Badge variant="secondary">Acme Corporation</Badge>
              <Button variant="outline" size="sm" data-testid="button-add-variant">
                + Add Variant
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Include common misspellings, abbreviations, and alternative names
            </p>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button data-testid="button-save-brand">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Competitors
          </CardTitle>
          <CardDescription>
            Manage competitor brands for comparison analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "TechCo", domain: "techco.com" },
              { name: "InnovateLabs", domain: "innovatelabs.io" },
              { name: "NextGen Solutions", domain: "nextgen.com" },
            ].map((competitor, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div>
                  <p className="font-medium">{competitor.name}</p>
                  <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                </div>
                <Button variant="ghost" size="sm" data-testid={`button-remove-competitor-${i}`}>
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-competitor">Competitor Name</Label>
              <Input
                id="new-competitor"
                placeholder="Enter competitor name"
                data-testid="input-new-competitor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitor-domain">Domain</Label>
              <Input
                id="competitor-domain"
                placeholder="competitor.com"
                data-testid="input-competitor-domain"
              />
            </div>
          </div>

          <Button variant="outline" data-testid="button-add-competitor">
            Add Competitor
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Configure when and how you receive updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Visibility Alerts</p>
              <p className="text-sm text-muted-foreground">
                Get notified when visibility scores change significantly
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-visibility-alerts" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">
                Receive a weekly summary of your AI visibility metrics
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-weekly-reports" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Recommendations</p>
              <p className="text-sm text-muted-foreground">
                Get notified when new optimization recommendations are available
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-new-recommendations" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your audit data and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" data-testid="button-export-csv">
              Export as CSV
            </Button>
            <Button variant="outline" data-testid="button-export-json">
              Export as JSON
            </Button>
            <Button variant="outline" data-testid="button-export-pdf">
              Generate PDF Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
