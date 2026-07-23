import { LegalPage, Section } from './LegalPage';

export default function MissionPage() {
  return (
    <LegalPage title="Our Mission" lastUpdated="July 21, 2026">
      <Section title="The Problem">
        <p>College students today face a paradox: they are more connected than ever digitally, yet struggle to form genuine connections on campus. Existing social platforms are riddled with fake profiles, spam, and privacy concerns. Students cannot trust who they are talking to.</p>
      </Section>

      <Section title="Our Mission">
        <p>To build the world's most trusted campus social network — where every connection is real, every profile is verified, and every student feels safe to be themselves.</p>
      </Section>

      <Section title="How We Achieve This">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">ERP Verification:</strong> Every account is cross-checked against university enrollment databases. Only real students get in.</li>
          <li><strong className="text-white">Privacy by Design:</strong> End-to-end encrypted chats, zero data selling, no third-party tracking, no ads.</li>
          <li><strong className="text-white">Zero Tolerance:</strong> Fake profiles, harassment, and inappropriate content are immediately removed.</li>
          <li><strong className="text-white">Community-Driven:</strong> Features are built based on student feedback, not corporate agendas.</li>
        </ul>
      </Section>

      <Section title="Our Vision for Campus Life">
        <p>We envision a campus where every student can find their people — study partners for finals, teammates for hackathons, friends for life, and maybe even a special someone. A campus where technology enhances the human experience, not replaces it.</p>
        <p className="mt-3">CampusMatch is not just an app. It is the beginning of a movement toward verified, trusted, meaningful campus connections.</p>
      </Section>
    </LegalPage>
  );
}
