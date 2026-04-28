import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

// Officer
import { Dashboard as OfficerDashboard } from './pages/officer/Dashboard';
import { NewInspection } from './pages/officer/NewInspection';
import { InspectionDetail } from './pages/officer/InspectionDetail';
import { EditInspection } from './pages/officer/EditInspection';
import { Certificates } from './pages/officer/Certificates';
import { Settings as OfficerSettings } from './pages/officer/Settings';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInspections } from './pages/admin/AdminInspections';
import { InspectionReview } from './pages/admin/InspectionReview';
import { AdminCertificates } from './pages/admin/AdminCertificates';
import { AdminUsers, AdminStations } from './pages/admin/AdminUsersStations';

// Technical
import { TechnicalDashboard } from './pages/technical/TechnicalDashboard';
import { TechnicalLogs } from './pages/technical/TechnicalLogs';
import { TechnicalUsers } from './pages/technical/TechnicalUsers';
import { TechnicalStations } from './pages/technical/TechnicalStations';

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Officer Portal */}
            <Route
              path="/officer"
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<OfficerDashboard />} />
              <Route path="inspection/new" element={<NewInspection />} />
              <Route path="inspection/:id" element={<InspectionDetail />} />
              <Route path="inspection/edit/:id" element={<EditInspection />} />
              <Route path="certificates" element={<Certificates />} />
              <Route path="settings" element={<OfficerSettings />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="inspections" element={<AdminInspections />} />
              <Route path="inspection/:id" element={<InspectionReview />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="stations" element={<AdminStations />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Technical Portal */}
            <Route
              path="/technical"
              element={
                <ProtectedRoute allowedRoles={['technical']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<TechnicalDashboard />} />
              <Route path="logs" element={<TechnicalLogs />} />
              <Route path="users" element={<TechnicalUsers />} />
              <Route path="stations" element={<TechnicalStations />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;
