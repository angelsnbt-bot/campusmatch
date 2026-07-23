import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function TermsOfService() {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: July 21, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CampusMatch ("the Service"), you agree to be bound by these Terms of Service.
              CampusMatch is an ERP-verified social network exclusively for enrolled college students. If you do
              not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Eligibility</h2>
            <p>
              The Service is available only to currently enrolled college students who have a valid ERP number
              and institutional email address. You must be at least 18 years of age. By using CampusMatch, you
              represent and warrant that you meet these eligibility requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
            <p>
              You must provide accurate, complete information during registration including your full name,
              college email, phone number, ERP number, college, course, branch, and year. You are responsible
              for maintaining the confidentiality of your password and for all activity under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Verification</h2>
            <p>
              CampusMatch uses ERP verification to ensure all users are genuine students. Submitting false or
              forged identification documents is strictly prohibited and will result in immediate account
              termination and potential legal action.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Impersonate another person or student</li>
              <li>Harass, bully, or intimidate other users</li>
              <li>Post offensive, obscene, or illegal content</li>
              <li>Use the Service for commercial purposes without authorization</li>
              <li>Attempt to circumvent the verification process</li>
              <li>Scrape, crawl, or use automated tools on the Service</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Content</h2>
            <p>
              You retain ownership of content you post on CampusMatch. By posting content, you grant
              CampusMatch a non-exclusive, worldwide license to use, display, and distribute your content
              within the Service. You are solely responsible for the content you share.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
            <p>
              CampusMatch reserves the right to suspend or terminate your account at any time for violation
              of these terms, including but not limited to: submitting false verification documents, harassment
              of other users, or any activity that compromises the safety of the community.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p>
              CampusMatch is provided "as is" without warranties of any kind. We are not liable for any
              damages arising from your use of the Service. We do not guarantee uninterrupted or error-free
              operation of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of the Service after
              changes constitutes acceptance of the modified terms. We will notify users of material changes
              via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>
              For questions about these Terms, contact us at{' '}
              <a href="mailto:support@campusmatch.in" className="text-primary hover:underline">
                support@campusmatch.in
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <Link href="/" className="text-primary hover:text-primary/80 text-sm transition-colors">
            Back to CampusMatch
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
