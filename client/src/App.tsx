// =============================================================================
// client/src/App.tsx — Router and app providers
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthContext, useAuthState } from './hooks/useAuth';
import { LangProvider } from './lib/i18n';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public pages
import { HomePage } from './modules/public/HomePage';
import { GuidelinesPage } from './modules/public/GuidelinesPage';
import { AssetsPage } from './modules/public/AssetsPage';

// Auth pages
import { LoginPage } from './pages/auth/LoginPage';
import { AcceptInvitePage } from './pages/auth/AcceptInvitePage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Admin pages
import { AdminDashboard } from './modules/admin/AdminDashboard';
import { CiEditorPage } from './modules/admin/ci/CiEditorPage';
import { MoodboardPage } from './modules/admin/moodboard/MoodboardPage';
import { ProjectsPage } from './modules/admin/projects/ProjectsPage';
import { UsersPage } from './modules/admin/users/UsersPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

function AppRoutes() {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="guidelines" element={<GuidelinesPage />} />
            <Route path="assets" element={<AssetsPage />} />
          </Route>

          {/* Auth */}
          <Route path="auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="accept-invite" element={<AcceptInvitePage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Admin workspace (protected) */}
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="ci" element={<CiEditorPage />} />
            <Route path="moodboard" element={<MoodboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        <AppRoutes />
      </LangProvider>
    </QueryClientProvider>
  );
}
