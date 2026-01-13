import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LineChart, ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/landing">
            <div className="flex items-center gap-2 cursor-pointer">
              <LineChart className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">AIO Mapper</span>
            </div>
          </Link>
          <Link href="/landing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 13, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-4">
              AIO Mapper ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI brand visibility intelligence platform.
            </p>
            <p className="text-muted-foreground">
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium mb-3">2.1 Personal Information</h3>
            <p className="text-muted-foreground mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Register for an account</li>
              <li>Subscribe to our Service</li>
              <li>Contact us for support</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="text-muted-foreground mb-4">This information may include:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Name and email address</li>
              <li>Company name and job title</li>
              <li>Billing address and payment information</li>
              <li>Phone number</li>
              <li>Account credentials</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.2 Usage Information</h3>
            <p className="text-muted-foreground mb-4">We automatically collect certain information when you use the Service:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Pages viewed and features used</li>
              <li>Time spent on the Service</li>
              <li>Referring URLs</li>
            </ul>

            <h3 className="text-xl font-medium mb-3">2.3 Brand Data</h3>
            <p className="text-muted-foreground">
              To provide our Service, we collect information about the brands you track, including brand names, domains, competitors, and the AI visibility data we gather on your behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
              <li>Personalize and improve your experience</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, hosting, analytics)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> When you have given us permission to share your information</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide you with the Service. We will also retain and use your information as necessary to comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise these rights, please contact us at privacy@aiomapper.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to collect and track information about your activity on our Service. Cookies are small data files stored on your device.
            </p>
            <p className="text-muted-foreground mb-4">We use the following types of cookies:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the Service to function</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our Service</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
            <p className="text-muted-foreground">
              Our Service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground">
              Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We take appropriate safeguards to ensure your information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Email:</strong> privacy@aiomapper.com<br />
              <strong>Address:</strong> AIO Mapper, Inc.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. California Privacy Rights</h2>
            <p className="text-muted-foreground mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>The right to know what personal information we collect and how we use it</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>The right to non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">15. GDPR Compliance</h2>
            <p className="text-muted-foreground">
              If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). Our legal basis for collecting and using your personal information depends on the specific context, including performance of a contract, your consent, our legitimate interests, and compliance with legal obligations.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-primary" />
              <span className="font-semibold">AIO Mapper</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/terms">
                <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
              </Link>
              <Link href="/pricing">
                <span className="hover:text-foreground cursor-pointer">Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
