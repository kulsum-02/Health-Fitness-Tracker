
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

import { ToastProvider } from "./context/ToastContext";
import { GoalProvider } from "./context/GoalContext";
import { HealthProvider } from "./context/HealthContext";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { GoalsPage } from "./pages/GoalsPage";
import { HealthPage } from "./pages/HealthPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ReportsPage } from "./pages/ReportsPage";
import { RecommendationsPage } from "./pages/RecommendationsPage";

import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Profile from "./pages/profile.jsx";
import WorkoutActivityPage from "./pages/WorkoutActivityPage.jsx";

function App() {
  return (
    <ToastProvider>
      <GoalProvider>
        <HealthProvider>
          <BrowserRouter>
            <Routes>
              {/* Open Dashboard by default */}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              {/* Login, Register and Profile */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              {/* Workout and Activity Tracking */}
              <Route
                path="/workout-activity"
                element={<WorkoutActivityPage />}
              />

              {/* Dashboard and its pages */}
              <Route element={<DashboardLayout />}>
                <Route
                  path="/dashboard"
                  element={<DashboardPage />}
                />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/health" element={<HealthPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route
                  path="/recommendations"
                  element={<RecommendationsPage />}
                />
              </Route>

              {/* Account navigation */}
              <Route
                path="/account"
                element={
                  <div style={{ padding: "24px", fontFamily: "Arial" }}>
                    <h1>Account</h1>
                    <p><Link to="/login">Log In</Link></p>
                    <p><Link to="/register">Create Account</Link></p>
                    <p><Link to="/profile">My Profile</Link></p>
                    <p><Link to="/dashboard">Dashboard</Link></p>
                  </div>
                }
              />

              {/* Unknown routes go to Dashboard */}
              <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          </BrowserRouter>
        </HealthProvider>
      </GoalProvider>
    </ToastProvider>
  );
}

export default App;
