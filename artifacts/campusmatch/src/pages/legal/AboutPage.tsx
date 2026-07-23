import { LegalPage, Section } from './LegalPage';

export default function AboutPage() {
  return (
    <LegalPage title="About CampusMatch" lastUpdated="July 21, 2026">
      <Section title="Our Story">
        <p>CampusMatch was born from a simple frustration — college social platforms are flooded with fake profiles, bots, and non-students. We believed campus life deserved better. In 2026, we set out to build a social network where every single user is a real, verified student.</p>
        <p className="mt-3">Starting at VGU Jaipur, CampusMatch connects students through dating, friendships, study groups, career networking, hackathons, sports, marketplace, and events — all within a trusted, verified ecosystem.</p>
      </Section>

      <Section title="What We Do">
        <p>CampusMatch is more than a social app. It is the digital backbone of campus life. We provide modules for every aspect of the student experience — from finding study partners and teammates to discovering events and buying second-hand textbooks.</p>
        <p className="mt-3">Our ERP verification system ensures that every profile belongs to a genuine, enrolled student. No fakes. No catfishing. No privacy concerns. Just real students making real connections.</p>
      </Section>

      <Section title="Our Values">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Trust First:</strong> Every user is ERP-verified. We never compromise on community integrity.</li>
          <li><strong className="text-white">Privacy Always:</strong> End-to-end encryption, zero data selling, no ads. Your data stays yours.</li>
          <li><strong className="text-white">Student-First Design:</strong> Every feature is built with students in mind — from exam season study groups to placement season networking.</li>
          <li><strong className="text-white">Inclusivity:</strong> CampusMatch is for every student, regardless of background, branch, or year.</li>
        </ul>
      </Section>

      <Section title="The Team">
        <p>CampusMatch is built by a team of passionate students and engineers who understand the campus experience firsthand. We are driven by the belief that technology should make campus life better, not more complicated.</p>
      </Section>

      <Section title="Contact">
        <p>Got questions? Reach us at <a href="mailto:hello@campusmatch.in" className="text-blue-400 hover:underline">hello@campusmatch.in</a></p>
      </Section>
    </LegalPage>
  );
}
