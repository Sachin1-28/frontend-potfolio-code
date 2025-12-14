import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import Login from "./pages/Admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SkillManager from "./pages/Admin/AddSkill";
import ProjectsPage from "./pages/Admin/ProjectsPage";
import ExperiencesPage from "./pages/Admin/ExperiencesPage";
import CertificationsPage from "./pages/Admin/CertificationsPage";
import AdminLayout from "./components/AdminLayout"; // Import the layout
import Portfolio from "./pages/Portfolio/Portfolio";
import AboutManagerPage from "./pages/Admin/AboutPage";
import ContactResponsesPage from "./pages/Admin/ContactResponsesPage";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public route - only login is accessible without authentication */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/" element={<Portfolio />} />

          <Route
            path="/admin/skills"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <SkillManager />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProjectsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/experiences"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ExperiencesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/certifications"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CertificationsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/about"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AboutManagerPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/responses"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ContactResponsesPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/admin" element={<Navigate to="/" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;