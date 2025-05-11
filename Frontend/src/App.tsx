import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout components
import Layout from "./components/layout/Layout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Chores from "./pages/dashboard/Chores";
import Expenses from "./pages/dashboard/Expenses";
import Calendar from "./pages/dashboard/Calendar";
import CreateHousehold from "./pages/household/CreateHousehold";
import JoinHousehold from "./pages/household/JoinHousehold";
import Members from "./pages/household/Members";
import HouseholdSettings from "./pages/household/HouseholdSettings";
import HouseholdSelection from "./pages/household/HouseholdSelection";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

// Protected route component that requires authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth route component that redirects to dashboard if already logged in
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about-us" element={<AboutUs />} />

      {/* Auth routes - redirect to dashboard if logged in */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chores" element={<Chores />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>

      <Route
        path="/household"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="selection" element={<HouseholdSelection />} />
        <Route path="create" element={<CreateHousehold />} />
        <Route path="join" element={<JoinHousehold />} />
        <Route path="members" element={<Members />} />
        <Route path="settings" element={<HouseholdSettings />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
