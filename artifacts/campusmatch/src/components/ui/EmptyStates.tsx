import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  UserPlus,
  Heart,
  CalendarDays,
  MessageCircle,
  Bell,
  ShoppingBag,
  Search,
  type LucideIcon,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const },
};

function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <motion.div
      className="flex max-w-xs flex-col items-center gap-4 px-4 py-8 text-center"
      {...fadeIn}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
        <Icon className="h-6 w-6 text-white/40" />
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs leading-relaxed text-white/40">{description}</p>
      </div>
      {ctaLabel && ctaHref && (
        <Link
          to={ctaHref}
          className="mt-1 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2 text-xs font-medium text-white shadow-md shadow-pink-500/20 transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/30"
        >
          {ctaLabel}
        </Link>
      )}
    </motion.div>
  );
}

export function EmptyFriends() {
  return (
    <EmptyState
      icon={UserPlus}
      title="No friends yet"
      description="Start connecting with classmates and build your campus network."
      ctaLabel="Find Friends"
      ctaHref="/discover"
    />
  );
}

export function EmptyMatches() {
  return (
    <EmptyState
      icon={Heart}
      title="No matches yet"
      description="Swipe through profiles to find people who share your interests."
      ctaLabel="Discover People"
      ctaHref="/discover"
    />
  );
}

export function EmptyEvents() {
  return (
    <EmptyState
      icon={CalendarDays}
      title="No events yet"
      description="Be the first to create an event and bring the campus together."
      ctaLabel="Create Event"
      ctaHref="/events"
    />
  );
}

export function EmptyMessages() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="No messages yet"
      description="Start a conversation with a match or friend."
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications yet"
      description="You're all caught up! We'll let you know when something happens."
    />
  );
}

export function EmptyMarketplace() {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="No listings yet"
      description="Sell or give away items to fellow students."
      ctaLabel="Create Listing"
      ctaHref="/marketplace"
    />
  );
}

export function EmptySearch() {
  return (
    <EmptyState
      icon={Search}
      title="No results found"
      description="Try adjusting your search or explore something different."
    />
  );
}

export function EmptyProfile({
  type,
}: {
  type: 'posts' | 'photos' | 'interests';
}) {
  const config = {
    posts: {
      title: 'No posts yet',
      description: 'Share your thoughts and campus moments.',
    },
    photos: {
      title: 'No photos yet',
      description: 'Add photos to showcase your campus life.',
    },
    interests: {
      title: 'No interests added',
      description: 'Add interests to help others get to know you.',
    },
  }[type];

  return <EmptyState icon={Heart} title={config.title} description={config.description} />;
}
