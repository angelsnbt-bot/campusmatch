import { LegalPage, Section } from './LegalPage';

export default function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy" lastUpdated="July 21, 2026">
      <Section title="What Are Cookies">
        <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and keep you logged in.</p>
      </Section>

      <Section title="Cookies We Use">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Essential Cookies:</strong> Required for authentication, session management, and security. These cannot be disabled.</li>
          <li><strong className="text-white">Preference Cookies:</strong> Remember your theme (dark/light), language, and display preferences.</li>
          <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how students use CampusMatch so we can improve the experience. All data is anonymized.</li>
        </ul>
      </Section>

      <Section title="Cookies We Do NOT Use">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li>Third-party advertising cookies</li>
          <li>Social media tracking pixels</li>
          <li>Cross-site tracking cookies</li>
          <li>Data broker cookies</li>
        </ul>
      </Section>

      <Section title="Managing Cookies">
        <p>You can control cookies through your browser settings. Disabling essential cookies may prevent you from logging in or using certain features. To manage cookies in your browser, visit the settings or preferences section.</p>
      </Section>

      <Section title="Changes to This Policy">
        <p>We may update this Cookie Policy periodically. Material changes will be communicated via email or in-app notification.</p>
      </Section>

      <Section title="Contact">
        <p>Questions about cookies? Email <a href="mailto:privacy@campusmatch.in" className="text-blue-400 hover:underline">privacy@campusmatch.in</a></p>
      </Section>
    </LegalPage>
  );
}
