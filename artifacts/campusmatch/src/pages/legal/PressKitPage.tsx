import { LegalPage, Section } from './LegalPage';

export default function PressKitPage() {
  return (
    <LegalPage title="Press Kit" lastUpdated="July 21, 2026">
      <Section title="Brand Overview">
        <p>CampusMatch is the world's first ERP-verified campus social network. We connect real students through dating, friendships, study groups, career networking, hackathons, sports, marketplace, and events.</p>
      </Section>

      <Section title="Brand Identity">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Name:</strong> CampusMatch</li>
          <li><strong className="text-white">Tagline:</strong> Your Campus. Connected.</li>
          <li><strong className="text-white">Colors:</strong> Electric Blue (#3b82f6), Royal Purple (#8b5cf6), Neon Cyan (#06b6d4)</li>
          <li><strong className="text-white">Font:</strong> Inter (primary), Instrument Serif (display)</li>
        </ul>
      </Section>

      <Section title="Logo Usage">
        <p>The CampusMatch logo should always be used on dark backgrounds. Do not alter colors, proportions, or add effects. The logo icon (lightning bolt) may be used independently as a favicon or app icon.</p>
      </Section>

      <Section title="Key Facts">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>100% ERP-verified student network</li>
          <li>8 modules: Dating, Friends, Study, Career, Hackathons, Sports, Marketplace, Events</li>
          <li>End-to-end encrypted messaging</li>
          <li>Zero ads, zero data selling</li>
          <li>Built by students, for students</li>
        </ul>
      </Section>

      <Section title="Media Contact">
        <p>For press inquiries, interviews, or media assets, contact <a href="mailto:press@campusmatch.in" className="text-blue-400 hover:underline">press@campusmatch.in</a></p>
      </Section>
    </LegalPage>
  );
}
