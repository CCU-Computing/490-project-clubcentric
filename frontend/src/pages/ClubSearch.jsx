import React, { useState } from 'react';
import BGImage from '../assets/images/BGImage.jpg';
import '../components/ClubSearch.css';

function ClubSearch() {
    const clubs = [
        { name: "Chess Enthusiasts Club", description: "For lovers of strategy and competition.", tags: ["board games", "strategy", "tournaments"], page: "chess.html" },
        { name: "Space Exploration Society", description: "Discuss the universe, astronomy, and rockets.", tags: ["science", "astronomy", "NASA"], page: "space.html" },
        { name: "Cooking Adventures", description: "Experiment with recipes and share delicious food.", tags: ["food", "recipes", "baking", "cooking"], page: "cooking.html" },
        { name: "Photography Circle", description: "Capture beautiful moments and learn camera skills.", tags: ["art", "cameras", "editing"], page: "photography.html" },
        { name: "Hiking & Outdoors Club", description: "Explore trails, mountains, and the great outdoors.", tags: ["nature", "fitness", "travel"], page: "hiking.html" },
        { name: "Esports Alliance", description: "Competitive gaming community for all skill levels.", tags: ["gaming", "tournaments", "teamwork"], page: "esports.html" },
        { name: "Music Makers Guild", description: "Collaborate on music projects and jam sessions.", tags: ["instruments", "band", "performance"], page: "music.html" },
        { name: "Creative Writing Club", description: "Share stories, poetry, and sharpen your writing skills.", tags: ["literature", "storytelling", "poetry"], page: "writing.html" },
        { name: "Cultural Foodies", description: "Discover and share traditional dishes from around the world.", tags: ["food", "culture", "recipes", "cooking"], page: "foodies.html" }
    ];
    
    

    const [search, setSearch] = useState("");

    function getMatchRank(club, query) {
        const q = query.toLowerCase();
        if (club.name.toLowerCase().includes(q)) return 1;
        if (club.description.toLowerCase().includes(q)) return 2;
        if (club.tags.some(tag => tag.toLowerCase().includes(q))) return 3;
        return 999;
    }

    const filteredClubs = clubs
        .map(club => ({ ...club, rank: getMatchRank(club, search) }))
        .filter(club => club.rank !== 999)
        .sort((a, b) => a.rank - b.rank);

    return (
        <div className="club-search-container">
            <div className="app">
                {/* Home Screen */}
                <div className="home-screen welcome-box">
                    <h1>Welcome to the Clubs Directory</h1>
                </div>
                
                <div className="layout">
                    <div className="main-content">
                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Type to search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        {filteredClubs.length > 0 ? (
                            filteredClubs.map((club, index) => (
                                <div key={index} className="club">
                                    <h3>{club.name}</h3>
                                    <p>{club.description}</p>
                                    <div className="tags">
                                        {club.tags.map((tag, i) => (
                                            <span key={i} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                    <a href={club.page}>Visit Page →</a>
                                </div>
                            ))
                        ) : (
                            <div className="no-clubs">No clubs found.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClubSearch;
