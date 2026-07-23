import { LegalPage, Section } from './LegalPage';

export default function FaqPage() {
  const faqs = [
    { q: 'Who can use CampusMatch?', a: 'Currently available for VGU students. You need a valid ERP number and college email to register. We plan to expand to more universities soon.' },
    { q: 'How does ERP verification work?', a: 'Submit your ERP number and upload your student ID card. Our system performs OCR analysis, cross-references with the university database, and our team manually verifies within 24 hours.' },
    { q: 'Is CampusMatch free?', a: 'Yes! Completely free for verified students. All core features — matching, messaging, events, marketplace — are included at no cost.' },
    { q: 'Is my data safe?', a: 'We use end-to-end encryption for chats, never sell your data, run no ads, and follow strict privacy practices. Your information stays yours.' },
    { q: 'Can I find study partners?', a: 'Yes! The Study Partners module lets you find study groups, exam prep partners, and project collaborators by branch, year, and subject.' },
    { q: 'How do I report someone?', a: 'Tap the Report button on any profile or message. You can also email safety@campusmatch.in. All reports are reviewed within 24 hours.' },
    { q: 'Can I delete my account?', a: 'Yes. Go to Settings > Account > Delete Account. Your data will be removed within 30 days. This action is irreversible.' },
    { q: 'How do I contact support?', a: 'Email support@campusmatch.in for general inquiries, safety@campusmatch.in for safety concerns, or privacy@campusmatch.in for data-related questions.' },
    { q: 'What if my verification is rejected?', a: 'You will receive a rejection reason via email. Common reasons include blurry ID photos or mismatched ERP numbers. You can resubmit after fixing the issue.' },
    { q: 'When will the mobile app launch?', a: 'We are building a React Native mobile app. Stay tuned for announcements on our blog and social media.' },
  ];

  return (
    <LegalPage title="Frequently Asked Questions" lastUpdated="July 21, 2026">
      <Section title="">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] cursor-pointer text-white font-semibold hover:border-blue-500/20 transition-colors list-none">
                {faq.q}
                <svg className="w-5 h-5 text-white/40 group-open:rotate-180 transition-transform shrink-0 ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
              </summary>
              <div className="px-4 pb-4 text-sm text-white/50 leading-relaxed mt-2">{faq.a}</div>
            </details>
          ))}
        </div>
      </Section>
    </LegalPage>
  );
}
