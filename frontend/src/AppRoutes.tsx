import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  getStoredAuthToken,
  getStoredUserRole,
  logout as apiLogout,
} from "./api/auth";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import EquipmentPage from "./components/EquipmentPage";
import CustomersPage from "./components/CustomersPage";
import RentalsPage from "./components/RentalsPage";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuthState = async () => {
    const token = await getStoredAuthToken();
    setIsAuthenticated(!!token);
    setRole(token ? await getStoredUserRole() : null);
  };

  // sprawdzanie tokena JWT przy starcie aplikacji
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshAuthState();
      } catch (error) {
        console.error("Błąd autoryzacji:", error);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    refreshAuthState();
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setRole(null);
    }
  };

  const isAdmin = role === "ROLE_ADMIN";

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-medium text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Routes>
        {/* Public routes (niedostępne dla zalogowanych użytkowników) */}
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Login onLoginSuccess={handleLoginSuccess} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute isAuthenticated={isAuthenticated}>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected routes (dostępne tylko po zalogowaniu) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout onLogout={handleLogout} isAdmin={isAdmin} role={role} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="equipment" element={<EquipmentPage />} />
          {/* Klienci — tylko admin. Backend i tak zwróci 403, to dodatkowa warstwa w UI. */}
          {isAdmin && <Route path="customers" element={<CustomersPage />} />}
          <Route path="rentals" element={<RentalsPage />} />
        </Route>

        {/* Domyślne przekierowania */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
