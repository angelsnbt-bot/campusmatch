import { LegalPage, Section } from './LegalPage';

export default function GdprPage() {
  return (
    <LegalPage title="GDPR Compliance" lastUpdated="July 21, 2026">
      <Section title="Your Rights Under GDPR">
        <p>If you are located in the European Economic Area (EEA), you have the following rights regarding your personal data:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Right of Access:</strong> Request a copy of all personal data we hold about you.</li>
          <li><strong className="text-white">Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong className="text-white">Right to Erasure:</strong> Request deletion of your personal data ("right to be forgotten").</li>
          <li><strong className="text-white">Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
          <li><strong className="text-white">Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong className="text-white">Right to Object:</strong> Object to processing of your data for specific purposes.</li>
          <li><strong className="text-white">Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
        </ul>
      </Section>

      <Section title="How to Exercise Your Rights">
        <p>To exercise any of these rights, email our Data Protection Officer at <a href="mailto:dpo@campusmatch.in" className="text-blue-400 hover:underline">dpo@campusmatch.in</a>. We will respond within 30 days.</p>
      </Section>

      <Section title="Data Processing">
        <p>We process personal data based on the following legal grounds:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
          <li><strong className="text-white">Contract:</strong> Processing necessary to provide the CampusMatch service.</li>
          <li><strong className="text-white">Consent:</strong> Where you have given explicit consent (e.g., marketing emails).</li>
          <li><strong className="text-white">Legitimate Interest:</strong> For fraud prevention, security, and service improvement.</li>
          <li><strong className="text-white">Legal Obligation:</strong> Where required by law.</li>
        </ul>
      </Section>

      <Section title="Data Transfers">
        <p>Your data may be processed in countries outside the EEA. We ensure adequate protection through Standard Contractual Clauses and other appropriate safeguards.</p>
      </Section>

      <Section title="Data Protection Officer">
        <p>Contact our DPO at <a href="mailto:dpo@campusmatch.in" className="text-blue-400 hover:underline">dpo@campusmatch.in</a> for any GDPR-related inquiries.</p>
      </Section>
    </LegalPage>
  );
}
