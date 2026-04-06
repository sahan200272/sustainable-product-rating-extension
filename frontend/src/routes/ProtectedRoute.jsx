import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * ProtectedRoute
 *
 * Wraps a route element and enforces authentication (and optionally role) checks.
 *
 * Props:
 *   element       {ReactNode} - The component to render when access is granted.
 *   requiredRole  {string}    - Optional. If provided, the user's role must match.
 *   redirectTo    {string}    - Where to redirect on failure (default: "/login").
 */
export default function ProtectedRoute({
    element,
    requiredRole,
    redirectTo = "/login",
}) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }

    if (!user?.emailVerified) {
        return <Navigate to="/verify-otp" replace state={{ from: location }} />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return element;
}
