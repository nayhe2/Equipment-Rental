import React from "react";
import { Navigate } from "react-router-dom";

interface PublicRouteProps {
  isAuthenticated: boolean;
  children: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({
  isAuthenticated,
  children,
}) => {
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
