import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs } from "../services/clubService";
import "../components/HomePage.css";

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

      {/* ✅ Featured Clubs */}
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

      {/* ✅ NEW: Events Section */}
      <section className="highlighted-clubs">
        <h2>Events</h2>
        <div className="club-cards">
          {/* Placeholder items — replace with actual event objects later */}
          <div className="club-card">
            <h3>Welcome Back Bash</h3>
            <p>Kick off the semester with food, games, and student org booths.</p>
          </div>
          <div className="club-card">
            <h3>Leadership Summit</h3>
            <p>Workshops and panels designed to grow your leadership skills.</p>
          </div>
          <div className="club-card">
            <h3>Volunteer Day</h3>
            <p>Join students for a community cleanup and service projects.</p>
          </div>
        </div>
      </section>

      {/* ✅ NEW: Documents Section (under Events) */}
      <section className="highlighted-clubs">
        <h2>Documents</h2>
        <div className="club-cards">
          <div className="club-card">
            <h3>Club Registration Packet</h3>
            <p>Information required to register or renew a club.</p>
          </div>
          <div className="club-card">
            <h3>Event Planning Guide</h3>
            <p>A checklist to help organize and host campus events.</p>
          </div>
          <div className="club-card">
            <h3>Funding Request Form</h3>
            <p>Instructions and requirements for applying for club funding.</p>
          </div>
        </div>
      </section>

      {/* Search Section */}
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
