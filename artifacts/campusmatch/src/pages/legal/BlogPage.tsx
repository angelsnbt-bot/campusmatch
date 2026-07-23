import { LegalPage, Section } from './LegalPage';

export default function BlogPage() {
  const posts = [
    { title: 'How ERP Verification Eliminates Fake Profiles', date: 'July 15, 2026', excerpt: 'Traditional social platforms struggle with fake accounts. Here is how CampusMatch uses university ERP databases to guarantee every user is a real student.' },
    { title: '5 Ways to Network Effectively on Campus', date: 'July 10, 2026', excerpt: 'Campus networking is not just about LinkedIn connections. Learn how to build meaningful relationships that last beyond graduation.' },
    { title: 'The Marketplace Revolution: Buy & Sell with Verified Students', date: 'July 5, 2026', excerpt: 'Why buying from verified students is safer, cheaper, and more trustworthy than anonymous marketplaces.' },
    { title: 'Hackathon Team Building: Find Your Perfect Co-Founder', date: 'June 28, 2026', excerpt: 'Building the right team is 80% of hackathon success. CampusMatch matches you with complementary skills and shared interests.' },
    { title: 'Study Groups That Actually Work', date: 'June 20, 2026', excerpt: 'Most study groups fizzle out. Here is the science behind effective collaborative learning and how CampusMatch facilitates it.' },
    { title: 'From Campus to Career: Leveraging Your Student Network', date: 'June 15, 2026', excerpt: 'Your campus network is your most valuable career asset. Learn how to build and leverage it before graduation.' },
  ];

  return (
    <LegalPage title="Blog" lastUpdated="July 21, 2026">
      <Section title="Latest Posts">
        <div className="space-y-6 mt-4">
          {posts.map((post, i) => (
            <div key={i} className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-blue-500/20 transition-colors">
              <p className="text-xs text-blue-400 mb-2 font-medium">{post.date}</p>
              <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{post.excerpt}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Subscribe">
        <p>Stay updated with the latest from CampusMatch. Follow us on social media or email us at <a href="mailto:blog@campusmatch.in" className="text-blue-400 hover:underline">blog@campusmatch.in</a> to contribute or suggest topics.</p>
      </Section>
    </LegalPage>
  );
}
