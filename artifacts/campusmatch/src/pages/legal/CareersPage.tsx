import { LegalPage, Section } from './LegalPage';

export default function CareersPage() {
  return (
    <LegalPage title="Careers" lastUpdated="July 21, 2026">
      <Section title="Join the Team">
        <p>CampusMatch is growing fast, and we are looking for passionate individuals who want to reshape how students connect. Whether you are a developer, designer, marketer, or community builder — if you care about the campus experience, we want to hear from you.</p>
      </Section>

      <Section title="Our Culture">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Ship Fast:</strong> We move quickly, iterate constantly, and celebrate progress over perfection.</li>
          <li><strong className="text-white">Student Empathy:</strong> Every team member understands the student experience because most of us are students or recent graduates.</li>
          <li><strong className="text-white">Remote-First:</strong> Work from anywhere. We care about output, not office hours.</li>
          <li><strong className="text-white">Ownership:</strong> You own your work end-to-end. No bureaucracy, no red tape.</li>
        </ul>
      </Section>

      <Section title="Open Positions">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Full-Stack Engineer (React, Node.js, PostgreSQL)</li>
          <li>Mobile Developer (React Native)</li>
          <li>UI/UX Designer</li>
          <li>DevOps Engineer</li>
          <li>Community Manager</li>
          <li>Growth Marketing Lead</li>
        </ul>
        <p className="mt-3">Send your resume and a short note about why you care about CampusMatch to <a href="mailto:careers@campusmatch.in" className="text-blue-400 hover:underline">careers@campusmatch.in</a></p>
      </Section>

      <Section title="Internships">
        <p>We offer internships for students who want real-world experience building a product used by thousands of students. Interns get full ownership, mentorship, and a stipend. Apply with your resume and portfolio.</p>
      </Section>
    </LegalPage>
  );
}
