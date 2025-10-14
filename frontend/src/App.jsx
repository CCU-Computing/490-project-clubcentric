import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClubPage from "./pages/ClubPage";
import ClubSearch from './components/ClubSearch';
import Navbar from './components/navbar/Navbar'; 

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl text-center font-bold">ClubCentric</h1>
      </header>

      <Navbar />

      <main className="flex-1 container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/club/:id" element={<ClubPage />} />
          <Route path="/club_search" element={<ClubSearch />} />
        </Routes>
      </main>

      <footer className="bg-gray-200 text-gray-700 p-4 text-center">
        &copy; 2025 ClubCentric
      </footer>
    </div>
  );
}

export default App;