import { LegalPage, Section } from './LegalPage';

export default function SafetyCenterPage() {
  return (
    <LegalPage title="Safety Center" lastUpdated="July 21, 2026">
      <Section title="Your Safety is Our Priority">
        <p>CampusMatch is designed with student safety at its core. Every user is ERP-verified, and we maintain strict moderation to keep our community safe. Here is how to stay safe and what to do if something goes wrong.</p>
      </Section>

      <Section title="Reporting Abuse">
        <p>If you encounter inappropriate behavior, fake profiles, or any content that makes you uncomfortable:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Use the <strong className="text-white">Report</strong> button on any profile or message</li>
          <li>Email <a href="mailto:safety@campusmatch.in" className="text-blue-400 hover:underline">safety@campusmatch.in</a> with details</li>
          <li>For immediate danger, contact local emergency services (100/112)</li>
        </ul>
        <p className="mt-3">All reports are reviewed within 24 hours. Your identity is never revealed to the reported user.</p>
      </Section>

      <Section title="Fake Profiles">
        <p>Our ERP verification system eliminates most fake profiles. However, if you encounter a suspicious account:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Do not engage with the account</li>
          <li>Report it immediately</li>
          <li>Do not share personal information</li>
          <li>Screenshot the profile for evidence</li>
        </ul>
      </Section>

      <Section title="Online Dating Safety">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Meet in public:</strong> Always meet first-time dates in campus public spaces</li>
          <li><strong className="text-white">Tell a friend:</strong> Let someone know where you are going and who you are meeting</li>
          <li><strong className="text-white">Trust your instincts:</strong> If something feels off, it probably is</li>
          <li><strong className="text-white">No pressure:</strong> You are never obligated to meet, share contact info, or continue chatting</li>
          <li><strong className="text-white">Block freely:</strong> Use the block feature without hesitation</li>
        </ul>
      </Section>

      <Section title="Marketplace Safety">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Meet in well-lit, public campus locations</li>
          <li>Inspect items before paying</li>
          <li>Use cash or campus-approved payment methods</li>
          <li>Report scams immediately</li>
          <li>Never share banking or UPI PINs</li>
        </ul>
      </Section>

      <Section title="Moderation">
        <p>Our moderation team works 24/7 to review reports, remove harmful content, and ban violators. We use a combination of AI-powered detection and human review to maintain community standards.</p>
      </Section>

      <Section title="Emergency Contacts">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">CampusMatch Safety:</strong> <a href="mailto:safety@campusmatch.in" className="text-blue-400 hover:underline">safety@campusmatch.in</a></li>
          <li><strong className="text-white">Police:</strong> 100</li>
          <li><strong className="text-white">Emergency:</strong> 112</li>
          <li><strong className="text-white">Women Helpline:</strong> 1091</li>
          <li><strong className="text-white">Cyber Crime:</strong> 1930</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
