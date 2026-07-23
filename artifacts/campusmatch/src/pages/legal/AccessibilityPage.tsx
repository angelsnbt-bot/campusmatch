import { LegalPage, Section } from './LegalPage';

export default function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility" lastUpdated="July 21, 2026">
      <Section title="Our Commitment">
        <p>CampusMatch is committed to ensuring digital accessibility for all users, including those with disabilities. We continuously work to improve the user experience for everyone and apply relevant accessibility standards.</p>
      </Section>

      <Section title="Accessibility Features">
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Keyboard Navigation:</strong> All features are accessible via keyboard. Use Tab to navigate, Enter to activate, and Escape to close modals.</li>
          <li><strong className="text-white">Screen Reader Support:</strong> ARIA labels, roles, and landmarks are used throughout the application for screen reader compatibility.</li>
          <li><strong className="text-white">Skip to Content:</strong> A skip-to-content link appears on focus for keyboard users to bypass navigation.</li>
          <li><strong className="text-white">Focus Indicators:</strong> Visible focus rings on all interactive elements.</li>
          <li><strong className="text-white">Color Contrast:</strong> Text meets WCAG 2.1 AA contrast requirements against backgrounds.</li>
          <li><strong className="text-white">Reduced Motion:</strong> Animations respect the prefers-reduced-motion media query.</li>
          <li><strong className="text-white">Responsive Design:</strong> Fully functional on all screen sizes from mobile to desktop.</li>
        </ul>
      </Section>

      <Section title="Standards">
        <p>We aim to conform to WCAG 2.1 Level AA guidelines. While we strive for full compliance, we recognize that accessibility is an ongoing process.</p>
      </Section>

      <Section title="Feedback">
        <p>If you encounter any accessibility barriers, please let us know at <a href="mailto:accessibility@campusmatch.in" className="text-blue-400 hover:underline">accessibility@campusmatch.in</a>. We take all feedback seriously and will work to address issues promptly.</p>
      </Section>
    </LegalPage>
  );
}
