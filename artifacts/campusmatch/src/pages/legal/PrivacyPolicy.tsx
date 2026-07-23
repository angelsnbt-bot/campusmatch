import { motion } from 'framer-motion';
import { Link } from 'wouter';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-[calc(100vh-80px)] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: July 21, 2026</p>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect the following information when you use CampusMatch:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong className="text-white">Account Information:</strong> Name, email address, phone number, ERP number, college, course, branch, and year of study</li>
              <li><strong className="text-white">Profile Information:</strong> Bio, interests, skills, hostel, profile photo, and other optional details you provide</li>
              <li><strong className="text-white">Verification Documents:</strong> ID card images submitted for ERP verification</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, and interaction patterns within the Service</li>
              <li><strong className="text-white">Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Verify your student status and maintain community trust</li>
              <li>Provide and improve the CampusMatch experience</li>
              <li>Match you with compatible students based on shared interests</li>
              <li>Send important account and security notifications</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
            <p>
              We do not sell your personal information to third parties. We may share your information
              only in the following circumstances:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>With other verified students within the Service (your profile information only)</li>
              <li>When required by law or to respond to legal process</li>
              <li>To protect the rights, property, or safety of CampusMatch, our users, or the public</li>
              <li>With service providers who assist in operating the Service (under strict data protection obligations)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption in transit (HTTPS),
              encrypted password storage, rate limiting, and access controls. However, no method of
              transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>
              We retain your account information for as long as your account is active. If you delete your
              account, we will remove your personal data within 30 days, except where we are required to
              retain certain information for legal or legitimate business purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Access and view your personal data</li>
              <li>Update or correct your information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of non-essential communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
            <p>
              CampusMatch uses essential cookies for authentication and session management. We do not use
              third-party tracking cookies or advertising cookies. You can manage cookie preferences through
              your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Children's Privacy</h2>
            <p>
              CampusMatch is not intended for users under 18 years of age. We do not knowingly collect
              personal information from children. If we become aware that a child has provided us with
              personal information, we will take steps to delete such information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the updated policy on CampusMatch and, where required, by email notification.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p>
              For privacy-related inquiries, contact our Data Protection Officer at{' '}
              <a href="mailto:privacy@campusmatch.in" className="text-primary hover:underline">
                privacy@campusmatch.in
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
