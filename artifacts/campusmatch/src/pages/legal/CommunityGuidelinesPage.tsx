import { LegalPage, Section } from './LegalPage';

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines" lastUpdated="July 21, 2026">
      <Section title="Our Community Standard">
        <p>CampusMatch exists to create a safe, trusted space for real students. These guidelines help us maintain that standard. Every user is responsible for upholding these values.</p>
      </Section>

      <Section title="Be Respectful">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Treat every student with dignity and respect</li>
          <li>No harassment, bullying, or intimidation of any kind</li>
          <li>No hate speech, discriminatory language, or slurs</li>
          <li>Respect boundaries — if someone says no, accept it gracefully</li>
        </ul>
      </Section>

      <Section title="Be Authentic">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Use your real photos and accurate profile information</li>
          <li>Do not catfish or impersonate another student</li>
          <li>Do not create multiple accounts</li>
          <li>Do not use the platform for commercial spam or solicitation</li>
        </ul>
      </Section>

      <Section title="Be Safe">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Do not share personal financial information</li>
          <li>Do not send or request explicit content from minors</li>
          <li>Report any suspicious or harmful behavior immediately</li>
          <li>Meet in public places for marketplace transactions</li>
        </ul>
      </Section>

      <Section title="Prohibited Content">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Sexual or explicit content</li>
          <li>Violence or graphic content</li>
          <li>Illegal activities or substances</li>
          <li>Spam, scams, or phishing attempts</li>
          <li>Copyright-infringing material</li>
        </ul>
      </Section>

      <Section title="Reporting">
        <p>If you encounter content or behavior that violates these guidelines, use the report button on the relevant profile or message. Our moderation team reviews all reports within 24 hours. You can also email <a href="mailto:safety@campusmatch.in" className="text-blue-400 hover:underline">safety@campusmatch.in</a>.</p>
      </Section>

      <Section title="Consequences">
        <p>Violations may result in warnings, temporary suspension, or permanent account termination depending on severity. Repeat offenders and accounts involved in illegal activity will be permanently banned and reported to the relevant authorities.</p>
      </Section>
    </LegalPage>
  );
}
