import './App.css'
import './components/!card/css/Cards.css'
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
// Import Pages
import DashboardPage from "./pages/DashboardPage";
import ClubPage from "./pages/club/ClubPage";
import ClubsPage from "./pages/ClubsPage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from './pages/auth/SignUpPage';
import ProfilePage from "./pages/ProfilePage";
import ViewUserPage from "./pages/ViewUserPage";
import ClubSearchPage from './pages/ClubSearchPage';
import Navbar from './components/navbar/Navbar'; // Navigation Bar
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function App() {

  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking session
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem', color: '#093331' }}>Loading...</p>
      </div>
    );
  }

  // Not authenticated - show login/signup only (no navbar)
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Authenticated - show navbar with protected routes
  return (
    <Navbar
      content={
        <Routes>
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/:id"
            element={
              <ProtectedRoute>
                <ViewUserPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/clubs"
            element={
              <ProtectedRoute>
                <ClubsPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <ClubSearchPage/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/club/:id"
            element={
              <ProtectedRoute>
                <ClubPage/>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      }
    />
  );
}

export default App
