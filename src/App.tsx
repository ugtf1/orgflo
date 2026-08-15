import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';

import { AppLayout } from './components/AppLayout';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { MemberDirectoryPage } from './pages/MemberDirectoryPage';
import { MemberDetailViewPage } from './pages/MemberDetailViewPage';
import { PivotMembersPage } from './pages/PivotMembersPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MeetingRecorderPage } from './pages/MeetingRecorderPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

import { MemberDashboardPage } from './pages/MemberDashboardPage';
import { MemberTransactionsPage } from './pages/MemberTransactionsPage';
import { MemberAccountPage } from './pages/MemberAccountPage';
import { MemberSettingsPage } from './pages/MemberSettingsPage';

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/member" replace />;
  }
  return children;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Portal Protected Routes */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/members"
        element={
          <RequireAdmin>
            <AppLayout>
              <MemberDirectoryPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/members/:memberId"
        element={
          <RequireAdmin>
            <AppLayout>
              <MemberDetailViewPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/pivot"
        element={
          <RequireAdmin>
            <AppLayout>
              <PivotMembersPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <RequireAdmin>
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RequireAdmin>
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/meetings"
        element={
          <RequireAdmin>
            <AppLayout>
              <MeetingRecorderPage />
            </AppLayout>
          </RequireAdmin>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireAdmin>
            <AppLayout>
              <AdminSettingsPage />
            </AppLayout>
          </RequireAdmin>
        }
      />

      {/* Member Portal Protected Routes */}
      <Route
        path="/member"
        element={
          <RequireAuth>
            <AppLayout>
              <MemberDashboardPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/member/transactions"
        element={
          <RequireAuth>
            <AppLayout>
              <MemberTransactionsPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/member/account"
        element={
          <RequireAuth>
            <AppLayout>
              <MemberAccountPage />
            </AppLayout>
          </RequireAuth>
        }
      />
      <Route
        path="/member/settings"
        element={
          <RequireAuth>
            <AppLayout>
              <MemberSettingsPage />
            </AppLayout>
          </RequireAuth>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
