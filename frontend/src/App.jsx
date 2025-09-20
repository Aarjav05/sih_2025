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
import ViewAttendance from "./components/Students/ViewAttendance";
import StaticStudent from "./components/StaticStudent";
import './App.css';
import Chatbot from "./components/Chatbot";

import './i18n';

// Inline route protection (no separate file needed)
function RoleProtected({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user?.role || "teacher";

  console.log("Current user role:", userRole);

  if (!allowedRoles.includes(userRole)) {
    // Redirect to appropriate default page based on role
    const getDefaultRoute = (role) => {
      switch (role) {
        case "district":
          return "/analytics";
        case "principal":
          return "/dashboard";
        case "teacher":
        default:
          return "/dashboard";
      }
    };
    return <Navigate to={getDefaultRoute(userRole)} replace />;
  }

  return children;
}

// Basic authentication protection (no role check)
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
          className="lg:hidden fixed top-3 left-4 z-50 p-3 rounded-lg hover:shadow-lg transition-shadow"
        >
          {!sidebarOpen && <Menu size={28} className="text-blue-600" />}
        </button>
      )}

      <main className={`
        min-h-screen overflow-x-auto transition-all duration-300
        ${isAuthenticated ? 'lg:ml-14' : ''}
        px-2 md:px-6 pt-2 lg:pt-4 pb-2
      `}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<RoleProtected allowedRoles={["teacher", "principal"]}><DashboardPage /></RoleProtected>}
          />
          <Route
            path="/view-attendance"
            element={<RoleProtected allowedRoles={["teacher", "principal"]}><ViewAttendance /></RoleProtected>}
          />
          <Route
            path="/attendance"
            element={<RoleProtected allowedRoles={["teacher"]}><AttendancePage /></RoleProtected>}
          />
          <Route
            path="/students"
            element={<RoleProtected allowedRoles={["teacher", "principal"]}><StudentDastboard /></RoleProtected>}
          />
          <Route
            path="/students/STU013"
            element={<StaticStudent />}
          />
          <Route
            path="/teachers"
            element={<Protected><TeachersPage /></Protected>}
          />
          <Route
            path="/analytics"
            element={<RoleProtected allowedRoles={["teacher", "principal", "district"]}><AnalyticsPage /></RoleProtected>}
          />
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
        <Chatbot></Chatbot>
      </main>
    </div >
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppLayout />
    </AuthProvider>
  );
}