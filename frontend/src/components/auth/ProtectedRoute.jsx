import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children })
{
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading spinner while checking session
    if (isLoading)
    {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated)
    {
        return <Navigate to="/login" replace />;
    }

    return children;
}