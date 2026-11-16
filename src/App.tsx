import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PortfolioDataProvider } from './contexts/PortfolioDataContext';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })));

export function App() {
  return (
    <Router>
      <AuthProvider>
        <PortfolioDataProvider>
          <Suspense fallback={<div role="status" className="min-h-screen grid place-items-center bg-[#FAF8F5] text-sm text-[#606760]">Loading…</div>}>
          <Routes>
            {/* Public Pages with Editorial Portfolio Layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/projects"
              element={
                <Layout>
                  <ProjectsPage />
                </Layout>
              }
            />
            <Route
              path="/projects/:slug"
              element={
                <Layout>
                  <ProjectDetailPage />
                </Layout>
              }
            />

            {/* Admin Authentication & Management Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
          </Suspense>
        </PortfolioDataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
