import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';
import { canApproveEvents, isStaffOrAdmin } from './utils/permissions';
import type { UserRole } from './types';

/** Simple placeholder for static info pages (Privacy, Terms, Consent) */
function InfoPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 leading-relaxed">{body}</p>
        <Link to="/login" className="mt-6 inline-block text-sm text-primary hover:underline">
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

// Auth Pages
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyCodePage,
  ResetPasswordPage,
  PasswordSuccessPage,
  VerificationErrorPage
} from './pages/auth';

// Main Pages
import { DashboardPage } from './pages/dashboard';
import { CalendarPage } from './pages/calendar';
import { TasksPage } from './pages/tasks';
import { NotificationsPage } from './pages/notifications';
import { SettingsPage } from './pages/settings';
import { ProfilePage } from './pages/profile';
import { ApprovalsPage } from './pages/approvals';

// Layout
import { Layout } from './components/layout';

import './index.css';

/** Redirects unauthenticated users to /login */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Redirects already-logged-in users away from auth pages */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/**
 * Role-protected route.
 * allowedRoles: explicit list — OR —
 * requireStaff: any staff-like role — OR —
 * requireApprover: only ADMIN / HEAD_OF_DEPARTMENT
 */
interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireStaff?: boolean;
  requireApprover?: boolean;
}

function RoleRoute({ children, allowedRoles, requireStaff, requireApprover }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  let allowed = true;
  if (allowedRoles) {
    allowed = user ? allowedRoles.includes(user.role) : false;
  } else if (requireApprover) {
    allowed = canApproveEvents(user);
  } else if (requireStaff) {
    allowed = isStaffOrAdmin(user);
  }

  if (!allowed) {
    // Silently redirect to dashboard instead of showing a blank/error page
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public Auth Routes ──────────────────────────────────────── */}
        <Route path="/login"             element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"          element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
        <Route path="/verify-code"       element={<VerifyCodePage />} />
        <Route path="/reset-password"    element={<ResetPasswordPage />} />
        <Route path="/password-success"  element={<PasswordSuccessPage />} />
        <Route path="/verification-error" element={<VerificationErrorPage />} />

        {/* ── Protected Routes (all authenticated users) ──────────────── */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout><DashboardPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/calendar" element={
          <PrivateRoute>
            <Layout><CalendarPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <Layout><TasksPage /></Layout>
          </PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute>
            <Layout><NotificationsPage /></Layout>
          </PrivateRoute>
        } />

        {/* ── Role-restricted: Approvals — ADMIN / HEAD_OF_DEPARTMENT only */}
        <Route path="/approvals" element={
          <RoleRoute requireApprover>
            <Layout><ApprovalsPage /></Layout>
          </RoleRoute>
        } />

        {/* ── Settings & Profile ───────────────────────────────────────── */}
        <Route path="/settings" element={
          <PrivateRoute><SettingsPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />

        {/* ── Static Info Pages (footer links) ────────────────────────── */}
        <Route path="/privacy" element={
          <InfoPage
            title="Privacy Policy"
            body="This Privacy Policy describes how the Department Academic Calendar collects, uses, and protects your personal information. We are committed to ensuring that your privacy is protected. Any information you provide will only be used in accordance with this policy."
          />
        } />
        <Route path="/terms" element={
          <InfoPage
            title="Terms of Service"
            body="By accessing and using the Department Academic Calendar system, you accept and agree to be bound by these Terms of Service. The system is intended for use by authorised students, staff, and faculty of the department only."
          />
        } />
        <Route path="/consent" element={
          <InfoPage
            title="Consent Preferences"
            body="You can manage your data consent preferences here. We use essential cookies to keep you logged in and to maintain your session. No third-party tracking or advertising cookies are used in this system."
          />
        } />

        {/* ── Catch-all ───────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
