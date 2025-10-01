import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClubPage from "./pages/ClubPage";

function App() {
  return (
    <Router>
      {/* You can style this wrapper */}
      <div className="min-h-screen flex flex-col">
        <header className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">ClubCentric</h1>
        </header>

        <main className="flex-1 container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/club/:id" element={<ClubPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-200 text-gray-700 p-4 text-center">
          &copy; 2025 ClubCentric
        </footer>
      </div>
    </Router>
  );
}

export default App;
