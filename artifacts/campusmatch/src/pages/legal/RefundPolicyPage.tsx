import { LegalPage, Section } from './LegalPage';

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" lastUpdated="July 21, 2026">
      <Section title="Free Tier">
        <p>CampusMatch is completely free for all verified students. No payment is required to access core features including matching, messaging, events, marketplace, and all other modules.</p>
      </Section>

      <Section title="Premium Plans">
        <p>If paid premium features are introduced in the future:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Monthly Plans:</strong> You may cancel at any time. No refund for the current billing period, but you retain premium access until the period ends.</li>
          <li><strong className="text-white">Lifetime Plans:</strong> One-time payment with no refunds after 14 days from purchase.</li>
          <li><strong className="text-white">Event Tickets:</strong> Full refund if cancelled 48+ hours before the event. 50% refund within 48 hours. No refund after the event starts.</li>
        </ul>
      </Section>

      <Section title="How to Request a Refund">
        <p>Email <a href="mailto:support@campusmatch.in" className="text-blue-400 hover:underline">support@campusmatch.in</a> with your account email, transaction ID, and reason for the refund request. We process refunds within 5-7 business days.</p>
      </Section>

      <Section title="Exceptions">
        <p>Refunds may be denied for accounts that have violated our Terms of Service or Community Guidelines. Abuse of the refund system will result in account suspension.</p>
      </Section>
    </LegalPage>
  );
}
