import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs } from "../services/clubService";
import "../components/homePage.css";
// IMPORTANT: Ensure the 'homeBG' import is NOT present here.

export default function HomePage() {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getClubs().then((data) => {
      if (data) setClubs(data);
    });
  }, []);

  const goToClub = (id) => {
    navigate(`/club/${id}`);
  };

  // Local filtering (search doesn’t navigate)
  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Background is handled entirely by CSS on this container
    <div className="homepage-container"> 
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Discover Campus Life & Opportunities</h1>
          <p>Find student organizations, upcoming events, and ways to engage.</p>
          <button
            className="cta-button"
            onClick={() => navigate("../club_search")}
          >
            Browse Clubs
          </button>
        </div>
      </header>

      {/* Search and Clubs */}
      <section className="search-overview">
        <h2>Quick Search</h2>
        <input
          type="text"
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="quick-search-input"
        />
      </section>

      {/* Featured Clubs */}
      <section className="highlighted-clubs">
        <h2>Featured Clubs</h2>
        <div className="club-cards">
          {filteredClubs.slice(0, 4).map((club) => (
            <div
              key={club.id}
              className="club-card"
              onClick={() => goToClub(club.id)}
            >
              <h3>{club.name}</h3>
              <p>{club.description}</p>
            </div>
          ))}
          {filteredClubs.length === 0 && (
            <div className="no-clubs">No clubs found.</div>
          )}
        </div>
      </section>

      {/* Explore More */}
      <section className="explore-more">
        <h2>Want to explore more?</h2>
        <button
          className="secondary-cta"
          onClick={() => navigate("../club_search")}
        >
          Browse Clubs
        </button>
      </section>
    </div>
  );
}