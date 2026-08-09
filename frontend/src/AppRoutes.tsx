import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getStoredAuthToken, logout as apiLogout } from "./api/auth";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "./components/Home";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sprawdzanie tokena JWT przy starcie aplikacji
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getStoredAuthToken();
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Błąd autoryzacji:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
    }
  };

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
              <Home onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
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