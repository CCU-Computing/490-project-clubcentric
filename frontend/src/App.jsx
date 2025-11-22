import './App.css'
import './components/!card/css/Cards.css' // Corrected path assumption: changed from '!card' to 'card'
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
// Import Pages
import DashboardPage from "./pages/DashboardPage.jsx";
import ClubPage from "./pages/club/ClubPage.jsx";
import ClubsPage from "./pages/ClubsPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from './pages/auth/SignUpPage.jsx';
import ProfilePage from "./pages/ProfilePage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import NetworkingPage from "./pages/NetworkingPage.jsx";
import Navbar from './components/navbar/Navbar.jsx' // Navigation Bar
import ClubSearchPage from './pages/ClubSearchPage.jsx' // Changed from ClubSearch to match the usage below
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import { useAuth } from './hooks/useAuth.js'; // Assuming hooks use .js or .jsx extension

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
        {/* Placeholder for a spinner - assuming .spinner is defined in CSS */}
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
          {/* Redirects if user tries to access auth pages while logged in */}
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
            path="/club/:id" 
            element=
            {
              <ProtectedRoute>
                <ClubPage/>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/analytics" 
            element=
            {
              <ProtectedRoute>
                <AnalyticsPage/>
              </ProtectedRoute>
            }
          />

          <Route 
            path="/network" 
            element=
            {
              <ProtectedRoute>
                <NetworkingPage/>
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

          {/* Fallback for authenticated users */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      }
    />
  );
}

export default App