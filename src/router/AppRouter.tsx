import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TransitionProvider } from "../context/TransitionContext";
import Dashboard from "../pages/Dashboard/Dashboard";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Landing from "../pages/Landing/Landing";



function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
    <TransitionProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </TransitionProvider>
    </BrowserRouter>
  );
}