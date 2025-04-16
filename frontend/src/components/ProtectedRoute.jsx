import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ProtectedRoute.css';

/**
 * ProtectedRoute component that redirects to login page if user is not authenticated
 * Can also check for specific roles
 */
const ProtectedRoute = ({ requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // If authentication status is still loading, show loading indicator
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a required role is specified, check if the user has it
  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    // Redirect to home or unauthorized page
    return <Navigate to="/" replace />;
  }

  // If authenticated and has required role (if any), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;