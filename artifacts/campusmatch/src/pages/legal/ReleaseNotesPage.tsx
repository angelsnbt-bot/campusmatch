import { LegalPage, Section } from './LegalPage';

export default function ReleaseNotesPage() {
  return (
    <LegalPage title="Release Notes" lastUpdated="July 21, 2026">
      <Section title="Version 1.0.0 — July 21, 2026">
        <p className="text-blue-400 font-medium mb-2">Initial Release</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Core Platform:</strong> Account creation, email OTP verification, ERP verification</li>
          <li><strong className="text-white">Dating Module:</strong> Profile creation, swipe matching, mutual likes, real-time chat</li>
          <li><strong className="text-white">Friends Module:</strong> Interest-based friend suggestions, friend requests, messaging</li>
          <li><strong className="text-white">Study Partners:</strong> Find study groups by branch, year, and subject</li>
          <li><strong className="text-white">Career Hub:</strong> Internship listings, referral system, mock interviews</li>
          <li><strong className="text-white">Hackathons:</strong> Event listings, AI team builder, team chat</li>
          <li><strong className="text-white">Sports:</strong> Team formation, tournament brackets, ground booking</li>
          <li><strong className="text-white">Marketplace:</strong> Buy and sell items between verified students</li>
          <li><strong className="text-white">Events:</strong> Campus event listings, RSVP, QR check-in</li>
          <li><strong className="text-white">Admin Panel:</strong> User management, verification queue, audit logs</li>
          <li><strong className="text-white">Premium Design:</strong> Glassmorphism UI, aurora background, spring animations</li>
          <li><strong className="text-white">Security:</strong> JWT authentication, rate limiting, input validation, E2E encryption ready</li>
        </ul>
      </Section>

      <Section title="What's Next">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Google OAuth integration</li>
          <li>Push notifications</li>
          <li>Video calling</li>
          <li>AI-powered matching improvements</li>
          <li>Mobile app (React Native)</li>
          <li>Premium subscription plans</li>
        </ul>
      </Section>
    </LegalPage>
  );
}
