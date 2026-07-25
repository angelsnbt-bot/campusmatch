import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  Check,
  Gamepad2,
  Code2,
  Camera,
  Music,
  Trophy,
  Palette,
  Dumbbell,
  Plane,
  BookOpenCheck,
  UtensilsCrossed,
  Disc3,
  Shirt,
  Rocket,
  HandHeart,
  MessageSquareMore,
  Users,
  Heart,
} from 'lucide-react';

const INTERESTS = [
  { label: 'Gaming', icon: Gamepad2 },
  { label: 'Coding', icon: Code2 },
  { label: 'Photography', icon: Camera },
  { label: 'Music', icon: Music },
  { label: 'Sports', icon: Trophy },
  { label: 'Art', icon: Palette },
  { label: 'Fitness', icon: Dumbbell },
  { label: 'Travel', icon: Plane },
  { label: 'Reading', icon: BookOpenCheck },
  { label: 'Cooking', icon: UtensilsCrossed },
  { label: 'Dance', icon: Disc3 },
  { label: 'Fashion', icon: Shirt },
  { label: 'Entrepreneurship', icon: Rocket },
  { label: 'Volunteering', icon: HandHeart },
  { label: 'Debate', icon: MessageSquareMore },
];

const CIRCLES = [
  { label: 'Study Partners', icon: BookOpen, description: 'Find people to study with' },
  { label: 'Friends', icon: Users, description: 'Make new friends on campus' },
  { label: 'Dates', icon: Heart, description: 'Find your special someone' },
];

const TOTAL_STEPS = 5;

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCircles, setSelectedCircles] = useState<string[]>([]);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const toggleInterest = (label: string) => {
    setSelectedInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label],
    );
  };

  const toggleCircle = (label: string) => {
    setSelectedCircles((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  const goNext = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const skip = () => {
    finish();
  };

  const finish = () => {
    localStorage.setItem('cm_onboarding_done', 'true');
    onComplete();
    setLocation('/dashboard');
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg mx-4">
        <div className="glass-card rounded-3xl p-8 overflow-hidden">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === step ? 'w-8 bg-gradient-to-r from-pink-500 to-purple-500' : 'w-2 bg-white/20',
                )}
              />
            ))}
          </div>

          {/* Skip Button */}
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <button
              onClick={skip}
              className="absolute top-6 right-6 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              Skip
            </button>
          )}

          {/* Step Content */}
          <div className="relative min-h-[420px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute inset-0"
              >
                {step === 0 && <StepWelcome onNext={goNext} />}
                {step === 1 && (
                  <StepInterests
                    selected={selectedInterests}
                    onToggle={toggleInterest}
                    onNext={goNext}
                  />
                )}
                {step === 2 && (
                  <StepCircles
                    selected={selectedCircles}
                    onToggle={toggleCircle}
                    onNext={goNext}
                  />
                )}
                {step === 3 && (
                  <StepNotifications
                    pushEnabled={pushEnabled}
                    emailEnabled={emailEnabled}
                    onPushToggle={setPushEnabled}
                    onEmailToggle={setEmailEnabled}
                    onNext={goNext}
                  />
                )}
                {step === 4 && <StepDone onFinish={finish} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Back Button */}
          {step > 0 && step < TOTAL_STEPS - 1 && (
            <button
              onClick={goBack}
              className="absolute bottom-8 left-8 flex items-center gap-1 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 1 — Welcome
   ───────────────────────────────────────────── */

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent"
      >
        Welcome to CampusMatch!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-white/60 text-sm"
      >
        Your verified campus journey starts here
      </motion.p>

      {/* Phone Mockup Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-40 h-72 rounded-[2rem] p-[2px] bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600"
      >
        <div className="w-full h-full rounded-[calc(2rem-2px)] bg-background/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-white/40 font-medium">CampusMatch</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button onClick={onNext} className="px-8">
          Get Started
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 2 — Choose Interests
   ───────────────────────────────────────────── */

function StepInterests({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (label: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">What are you interested in?</h2>
        <p className="text-sm text-white/50 mt-1">Pick as many as you like</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {INTERESTS.map((interest) => {
          const Icon = interest.icon;
          const active = selected.includes(interest.label);
          return (
            <motion.button
              key={interest.label}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(interest.label)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border',
                active
                  ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/50 text-pink-300'
                  : 'border-white/10 text-white/60 hover:border-white/20 hover:text-white/80',
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {interest.label}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Button onClick={onNext} disabled={selected.length === 0} className="px-8">
          Continue
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 3 — Find Your Circle
   ───────────────────────────────────────────── */

function StepCircles({
  selected,
  onToggle,
  onNext,
}: {
  selected: string[];
  onToggle: (label: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col h-full gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">Who do you want to connect with?</h2>
        <p className="text-sm text-white/50 mt-1">Choose your circles</p>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        {CIRCLES.map((circle) => {
          const Icon = circle.icon;
          const active = selected.includes(circle.label);
          return (
            <motion.button
              key={circle.label}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(circle.label)}
              className={cn(
                'glass-card rounded-xl p-4 flex items-center gap-4 transition-all duration-200 text-left',
                active && 'border-pink-500/40 bg-pink-500/5',
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                  active
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600'
                    : 'bg-white/5',
                )}
              >
                <Icon className={cn('w-6 h-6', active ? 'text-white' : 'text-white/50')} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{circle.label}</p>
                <p className="text-xs text-white/40">{circle.description}</p>
              </div>
              {active && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto pt-4 flex justify-center">
        <Button onClick={onNext} disabled={selected.length === 0} className="px-8">
          Continue
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 4 — Enable Notifications
   ───────────────────────────────────────────── */

function StepNotifications({
  pushEnabled,
  emailEnabled,
  onPushToggle,
  onEmailToggle,
  onNext,
}: {
  pushEnabled: boolean;
  emailEnabled: boolean;
  onPushToggle: (v: boolean) => void;
  onEmailToggle: (v: boolean) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col h-full items-center gap-6 text-center">
      {/* Animated Bell */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -8, 8, -4, 0],
        }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
          <Bell className="w-10 h-10 text-pink-400" />
        </div>
        {/* Pulse rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-pink-500/30"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/20"
          animate={{ scale: [1, 1.9], opacity: [0.4, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: 'easeOut' }}
        />
      </motion.div>

      <div>
        <h2 className="text-xl font-bold text-white">Stay in the loop</h2>
        <p className="text-sm text-white/50 mt-1">
          Get notified about events, messages, and match requests
        </p>
      </div>

      <div className="w-full max-w-xs flex flex-col gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-white">Push Notifications</span>
          <Switch checked={pushEnabled} onCheckedChange={onPushToggle} />
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-white">Email Digest</span>
          <Switch checked={emailEnabled} onCheckedChange={onEmailToggle} />
        </div>
      </div>

      <div className="mt-auto pt-2">
        <Button onClick={onNext} className="px-8">
          Continue
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Step 5 — You're All Set!
   ───────────────────────────────────────────── */

function StepDone({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30"
      >
        <svg
          viewBox="0 0 52 52"
          className="w-12 h-12"
        >
          <motion.path
            d="M14 27l7 7 16-16"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-white">You're all set!</h2>
        <p className="text-sm text-white/50 mt-1">Explore your campus</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <Button onClick={onFinish} className="px-8">
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}
