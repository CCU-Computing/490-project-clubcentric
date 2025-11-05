import React from 'react';
import '../components/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Club Finder</h1>
          <p>Discover and join clubs that match your interests</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="search-overview">
        <h2>Find a Club</h2>
        <input
          type="text"
          placeholder="Search clubs..."
          className="quick-search-input"
        />
      </section>

      {/* FEATURED CLUBS */}
      <section className="highlighted-clubs">
        <h2>Featured Clubs</h2>
        <div className="club-cards">
          <div className="club-card">Art Club</div>
          <div className="club-card">Chess Club</div>
          <div className="club-card">Coding Club</div>
        </div>
      </section>

      {/* EXPLORE MORE */}
      <section className="explore-more">
        <h2>Want to see more?</h2>
        <button className="secondary-cta">Explore All Clubs</button>
      </section>
    </div>
  );
};

export default HomePage;
