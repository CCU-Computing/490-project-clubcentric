import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
// Import Pages
import HomePage from "./pages/HomePage";
import ClubsPage from './pages/ClubsPage';
import ClubPage from "./pages/club/ClubPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from './components/navbar/Navbar' // Navigation Bar
import ClubSearch from './pages/ClubSearch'
import ProtectedRoute from './components/auth/AuthProvider';


function App() {

  return (
    <>
      <Navbar
          content={
            // Put all URLs in the routes block, each url gets a <Route/>
            <Routes>
              {/* To see a page with a :id in the url, add in an id parameter. For example: http://localhost:5173/edit/1 */}
              <Route path="/login" element={<LoginPage/>}/>
              <Route 
                path="/home" 
                element=
                {
                  <ProtectedRoute>
                    <HomePage/>
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/profile" 
                element=
                {
                  <ProtectedRoute>
                    <ProfilePage/>
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/clubs" 
                element=
                {
                  <ProtectedRoute>
                    <ClubsPage/>
                  </ProtectedRoute>
                }
              />

              <Route 
                path="/club_search" 
                element=
                {
                  <ProtectedRoute>
                    <ClubSearch/>
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
                path="/club_search" 
                element=
                {
                  <ProtectedRoute>
                    <ClubSearch/>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          }
      />

    </>
  )  
}

<Router>
      {/* You can style this wrapper */}
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl text-center font-bold">ClubCentric</h1>
        </header>

        <main className="flex-1 container mx-auto p-4">

        </main>

        
      </div>
    </Router>
export default App
