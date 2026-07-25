import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import OnboardingFlow from './OnboardingFlow';

export default function OnboardingTrigger() {
  const { user } = useAuth();
  const [show, setShow] = useState(() => {
    if (!user) return false;
    return !localStorage.getItem('cm_onboarding_done');
  });

  if (!show) return null;
  return <OnboardingFlow onComplete={() => setShow(false)} />;
}
