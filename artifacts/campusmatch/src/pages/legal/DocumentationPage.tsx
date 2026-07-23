import { LegalPage, Section } from './LegalPage';

export default function DocumentationPage() {
  return (
    <LegalPage title="Documentation" lastUpdated="July 21, 2026">
      <Section title="Getting Started">
        <p>Welcome to CampusMatch! This guide walks you through creating your account, verifying your student status, and getting the most out of the platform.</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Step 1:</strong> Sign up with your college email address</li>
          <li><strong className="text-white">Step 2:</strong> Complete your profile with basic details (name, phone, ERP, college)</li>
          <li><strong className="text-white">Step 3:</strong> Verify your email via OTP</li>
          <li><strong className="text-white">Step 4:</strong> Submit your ERP number and student ID for verification</li>
          <li><strong className="text-white">Step 5:</strong> Wait for approval (usually within 24 hours)</li>
        </ul>
      </Section>

      <Section title="Account Setup">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Profile Photo:</strong> Upload a clear, recent photo of yourself. This is how other students will recognize you.</li>
          <li><strong className="text-white">Bio:</strong> Write a short bio about yourself, your interests, and what you are looking for on CampusMatch.</li>
          <li><strong className="text-white">Interests:</strong> Select at least 3 interests. These help us match you with compatible students.</li>
        </ul>
      </Section>

      <Section title="Verification Flow">
        <p>ERP verification ensures CampusMatch remains a trusted, student-only community. Here is what happens after you submit:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>OCR analysis of your student ID card</li>
          <li>Cross-reference with university enrollment database</li>
          <li>Fraud detection checks</li>
          <li>Manual review by our verification team</li>
          <li>Status update via email and in-app notification</li>
        </ul>
      </Section>

      <Section title="Modules Overview">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Dating:</strong> Match with verified students. Mutual likes unlock chat.</li>
          <li><strong className="text-white">Friends:</strong> Find campus friends by branch, year, and interests.</li>
          <li><strong className="text-white">Study Partners:</strong> Form study groups, find exam prep partners.</li>
          <li><strong className="text-white">Career Hub:</strong> Internships, referrals, mock interviews.</li>
          <li><strong className="text-white">Hackathons:</strong> AI-powered team builder with GitHub matching.</li>
          <li><strong className="text-white">Sports:</strong> Find teammates, join tournaments, book grounds.</li>
          <li><strong className="text-white">Marketplace:</strong> Buy and sell textbooks, electronics, cycles.</li>
          <li><strong className="text-white">Events:</strong> RSVP to campus events with QR check-in.</li>
        </ul>
      </Section>

      <Section title="Troubleshooting">
        <p>If you encounter issues, try these steps:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Clear your browser cache and reload the page</li>
          <li>Ensure you are using a supported browser (Chrome, Firefox, Safari, Edge)</li>
          <li>Check your internet connection</li>
          <li>If the issue persists, email <a href="mailto:support@campusmatch.in" className="text-blue-400 hover:underline">support@campusmatch.in</a></li>
        </ul>
      </Section>
    </LegalPage>
  );
}
