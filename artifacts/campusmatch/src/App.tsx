import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/hooks/use-auth';
import { AppShell } from '@/components/layout/AppShell';

const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const VerifyOtp = lazy(() => import('@/pages/auth/VerifyOtp'));
const Verify = lazy(() => import('@/pages/auth/Verify'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

const Dashboard = lazy(() => import('@/pages/app/Dashboard'));
const Discover = lazy(() => import('@/pages/app/Discover'));
const Matches = lazy(() => import('@/pages/app/Matches'));
const Friends = lazy(() => import('@/pages/app/Friends'));
const Profile = lazy(() => import('@/pages/app/Profile'));
const UserProfile = lazy(() => import('@/pages/app/UserProfile'));
const Events = lazy(() => import('@/pages/app/Events'));
const Marketplace = lazy(() => import('@/pages/app/Marketplace'));
const Announcements = lazy(() => import('@/pages/app/Announcements'));

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminVerification = lazy(() => import('@/pages/admin/AdminVerification'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs'));

const TermsOfService = lazy(() => import('@/pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('@/pages/legal/PrivacyPolicy'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <AppShell><Suspense fallback={<PageLoader />}><Home /></Suspense></AppShell>
      </Route>
      <Route path="/login">
        <AppShell><Suspense fallback={<PageLoader />}><Login /></Suspense></AppShell>
      </Route>
      <Route path="/register">
        <AppShell><Suspense fallback={<PageLoader />}><Register /></Suspense></AppShell>
      </Route>
      <Route path="/verify-otp">
        <AppShell requireAuth><Suspense fallback={<PageLoader />}><VerifyOtp /></Suspense></AppShell>
      </Route>
      <Route path="/forgot-password">
        <AppShell><Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense></AppShell>
      </Route>
      <Route path="/verify">
        <AppShell requireAuth><Suspense fallback={<PageLoader />}><Verify /></Suspense></AppShell>
      </Route>

      <Route path="/dashboard">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></AppShell>
      </Route>
      <Route path="/discover">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Discover /></Suspense></AppShell>
      </Route>
      <Route path="/matches">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Matches /></Suspense></AppShell>
      </Route>
      <Route path="/friends">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Friends /></Suspense></AppShell>
      </Route>
      <Route path="/profile">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Profile /></Suspense></AppShell>
      </Route>
      <Route path="/profile/:userId">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><UserProfile /></Suspense></AppShell>
      </Route>
      <Route path="/events">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Events /></Suspense></AppShell>
      </Route>
      <Route path="/marketplace">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Marketplace /></Suspense></AppShell>
      </Route>
      <Route path="/announcements">
        <AppShell requireAuth requireVerification><Suspense fallback={<PageLoader />}><Announcements /></Suspense></AppShell>
      </Route>

      <Route path="/admin">
        <AppShell requireAuth requireVerification requireAdmin><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></AppShell>
      </Route>
      <Route path="/admin/verification">
        <AppShell requireAuth requireVerification requireAdmin><Suspense fallback={<PageLoader />}><AdminVerification /></Suspense></AppShell>
      </Route>
      <Route path="/admin/users">
        <AppShell requireAuth requireVerification requireAdmin><Suspense fallback={<PageLoader />}><AdminUsers /></Suspense></AppShell>
      </Route>
      <Route path="/admin/audit-logs">
        <AppShell requireAuth requireVerification requireAdmin><Suspense fallback={<PageLoader />}><AdminAuditLogs /></Suspense></AppShell>
      </Route>

      <Route path="/terms">
        <AppShell><Suspense fallback={<PageLoader />}><TermsOfService /></Suspense></AppShell>
      </Route>
      <Route path="/privacy">
        <AppShell><Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense></AppShell>
      </Route>

      <Route>
        <AppShell><NotFound /></AppShell>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
