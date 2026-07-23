import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from '@/hooks/use-auth';
import { AppShell } from '@/components/layout/AppShell';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import VerifyOtp from '@/pages/auth/VerifyOtp';
import Verify from '@/pages/auth/Verify';

// App Pages
import Dashboard from '@/pages/app/Dashboard';
import Discover from '@/pages/app/Discover';
import Matches from '@/pages/app/Matches';
import Friends from '@/pages/app/Friends';
import Profile from '@/pages/app/Profile';
import UserProfile from '@/pages/app/UserProfile';
import Events from '@/pages/app/Events';
import Marketplace from '@/pages/app/Marketplace';
import Announcements from '@/pages/app/Announcements';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminVerification from '@/pages/admin/AdminVerification';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminAuditLogs from '@/pages/admin/AdminAuditLogs';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public Marketing */}
      <Route path="/">
        <AppShell><Home /></AppShell>
      </Route>
      
      {/* Auth */}
      <Route path="/login">
        <AppShell><Login /></AppShell>
      </Route>
      <Route path="/register">
        <AppShell><Register /></AppShell>
      </Route>
      <Route path="/verify-otp">
        <AppShell requireAuth><VerifyOtp /></AppShell>
      </Route>
      <Route path="/verify">
        <AppShell requireAuth><Verify /></AppShell>
      </Route>

      {/* Dashboard App */}
      <Route path="/dashboard">
        <AppShell requireAuth requireVerification><Dashboard /></AppShell>
      </Route>
      <Route path="/discover">
        <AppShell requireAuth requireVerification><Discover /></AppShell>
      </Route>
      <Route path="/matches">
        <AppShell requireAuth requireVerification><Matches /></AppShell>
      </Route>
      <Route path="/friends">
        <AppShell requireAuth requireVerification><Friends /></AppShell>
      </Route>
      <Route path="/profile">
        <AppShell requireAuth requireVerification><Profile /></AppShell>
      </Route>
      <Route path="/profile/:userId">
        <AppShell requireAuth requireVerification><UserProfile /></AppShell>
      </Route>
      <Route path="/events">
        <AppShell requireAuth requireVerification><Events /></AppShell>
      </Route>
      <Route path="/marketplace">
        <AppShell requireAuth requireVerification><Marketplace /></AppShell>
      </Route>
      <Route path="/announcements">
        <AppShell requireAuth requireVerification><Announcements /></AppShell>
      </Route>

      {/* Admin Pages */}
      <Route path="/admin">
        <AppShell requireAuth requireVerification><AdminDashboard /></AppShell>
      </Route>
      <Route path="/admin/verification">
        <AppShell requireAuth requireVerification><AdminVerification /></AppShell>
      </Route>
      <Route path="/admin/users">
        <AppShell requireAuth requireVerification><AdminUsers /></AppShell>
      </Route>
      <Route path="/admin/audit-logs">
        <AppShell requireAuth requireVerification><AdminAuditLogs /></AppShell>
      </Route>

      {/* 404 */}
      <Route>
        <AppShell><NotFound /></AppShell>
      </Route>
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
