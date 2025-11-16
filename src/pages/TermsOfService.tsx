import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
        
        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using HeavyRentGo, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. User Accounts</h2>
            <p className="mb-4">To use our services, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Operator Responsibilities</h2>
            <p className="mb-4">As an equipment operator, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate equipment descriptions and pricing</li>
              <li>Ensure all equipment is safe and properly maintained</li>
              <li>Respond promptly to booking requests</li>
              <li>Honor confirmed bookings</li>
              <li>Maintain proper insurance coverage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Client Responsibilities</h2>
            <p className="mb-4">As a client, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use equipment only for lawful purposes</li>
              <li>Operate equipment safely and as intended</li>
              <li>Return equipment in the same condition</li>
              <li>Pay all fees and charges on time</li>
              <li>Report any damage or issues immediately</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Booking and Payment</h2>
            <p className="mb-4">
              All bookings are subject to availability. Payment must be made in full before equipment use. 
              We use Razorpay for secure payment processing. Refunds are handled according to our cancellation policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cancellation Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations 48+ hours before booking: Full refund</li>
              <li>Cancellations 24-48 hours before: 50% refund</li>
              <li>Cancellations less than 24 hours: No refund</li>
              <li>Operator cancellations: Full refund to client</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Liability and Insurance</h2>
            <p>
              HeavyRentGo is a marketplace platform connecting operators and clients. We are not responsible for 
              equipment condition, safety, or disputes between parties. Operators must maintain appropriate insurance. 
              Clients are responsible for any damage during rental period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Prohibited Activities</h2>
            <p className="mb-4">Users may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Post false or misleading information</li>
              <li>Engage in fraudulent activities</li>
              <li>Violate any laws or regulations</li>
              <li>Interfere with platform operations</li>
              <li>Harass or abuse other users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Intellectual Property</h2>
            <p>
              All content on HeavyRentGo, including text, graphics, logos, and software, is owned by us or our 
              licensors and protected by copyright and trademark laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms will be resolved through binding arbitration in accordance 
              with Indian law. You agree to waive any right to a jury trial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms or engage in 
              prohibited activities, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Changes to Terms</h2>
            <p>
              We may update these terms at any time. Continued use of the platform after changes constitutes 
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information</h2>
            <p>
              For questions about these terms, contact us at legal@heavyrentgo.com
            </p>
          </section>

          <p className="text-sm mt-8 pt-8 border-t border-border">
            Last Updated: November 2025
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
