import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from "./pages/AttendancePage";
import StudentDastboard from './components/Students/StudentDastboard';
import TeachersPage from "./pages/TeachersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Login from "./components/Login/Login";
import ToastContainer from "./components/ToastContainer";
import { AuthProvider, useAuth } from './Context/AuthContext';

// Inline route protection (no separate file needed)
function Protected({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

// This component is INSIDE the AuthProvider, so useAuth() works here
function MainAppLayout() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f4fe] relative">
      {isAuthenticated && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      {/* Mobile hamburger - only show when authenticated and on mobile */}
      {isAuthenticated && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Menu size={24} className="text-blue-600" />
        </button>
      )}

      <main className={`
        min-h-screen overflow-x-auto transition-all duration-300
        ${isAuthenticated ? 'lg:ml-14' : ''}
        px-2 md:px-6 pt-2 lg:pt-6 pb-2
      `}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<Protected><DashboardPage /></Protected>}
          />
          <Route
            path="/attendance"
            element={<Protected><AttendancePage /></Protected>}
          />
          <Route
            path="/students"
            element={<Protected><StudentDastboard /></Protected>}
          />
          <Route
            path="/teachers"
            element={<Protected><TeachersPage /></Protected>}
          />
          {/* <Route
            path="/analytics"
            element={<Protected><AnalyticsPage /></Protected>}
          /> */}
          <Route
            path="/"
            element={<Protected><DashboardPage /></Protected>}
          />
          <Route
            path="*"
            element={<Protected><DashboardPage /></Protected>}
          />
        </Routes>
        <ToastContainer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}