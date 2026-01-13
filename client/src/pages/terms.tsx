import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LineChart, ArrowLeft } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 13, 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing or using AIO Mapper ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all visitors, users, and others who access or use the Service. By using the Service, you represent that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              AIO Mapper is an AI brand visibility intelligence platform that measures and analyzes how brands appear in AI-generated answers across various AI search engines and platforms. Our Service includes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>AI search visibility monitoring and tracking</li>
              <li>Brand mention and citation analysis</li>
              <li>Competitive intelligence and comparison tools</li>
              <li>Actionable recommendations for improving AI visibility</li>
              <li>Reporting and analytics dashboards</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p className="text-muted-foreground mb-4">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
            </p>
            <p className="text-muted-foreground">
              You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
            <p className="text-muted-foreground mb-4">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly or annually), depending on the plan you select.
            </p>
            <p className="text-muted-foreground mb-4">
              At the end of each billing period, your subscription will automatically renew under the same conditions unless you cancel it or we cancel it. You may cancel your subscription renewal through your account settings or by contacting our support team.
            </p>
            <p className="text-muted-foreground">
              A valid payment method is required to process the payment for your subscription. You shall provide accurate and complete billing information. By submitting such payment information, you automatically authorize us to charge all subscription fees incurred through your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Free Trial</h2>
            <p className="text-muted-foreground mb-4">
              We may offer a free trial for a limited period. You may be required to enter your billing information to sign up for the free trial.
            </p>
            <p className="text-muted-foreground">
              If you do not cancel before the end of the free trial period, you will be automatically charged the applicable subscription fee for the plan you selected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to gain unauthorized access to any portion of the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Use automated systems to access the Service in a manner that exceeds reasonable use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of AIO Mapper and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            <p className="text-muted-foreground">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of AIO Mapper.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Data and Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal data.
            </p>
            <p className="text-muted-foreground">
              You retain all rights to the data you input into the Service. You grant us a license to use this data solely for the purpose of providing and improving the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-4">
              THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. AIO MAPPER EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-muted-foreground">
              We do not warrant that the Service will be uninterrupted, timely, secure, or error-free, or that any defects will be corrected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              IN NO EVENT SHALL AIO MAPPER, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms.
            </p>
            <p className="text-muted-foreground">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2">
              <strong>Email:</strong> legal@aiomapper.com<br />
              <strong>Address:</strong> AIO Mapper, Inc.
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
              <Link href="/privacy">
                <span className="hover:text-foreground cursor-pointer">Privacy Policy</span>
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
