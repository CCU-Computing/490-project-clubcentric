import React, { useState, useEffect } from 'react';
import { Calendar, PartyPopper, Users } from 'lucide-react';
import BGImage from '../assets/images/BGImage.jpg';
import './ClubSearch.css';

function ClubSearch() {
    
    // TEMPORARY club data is initialized here
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

    const schedule = [
        { day: "Sunday", events: [{ name: "Brunch Meetup", time: "11:00 AM" }] },
        { day: "Monday", events: [
        { name: "Club Meeting", time: "4:00 PM" },
        { name: "Study Session", time: "6:00 PM" }
        ]},
        { day: "Tuesday", events: [{ name: "Photography Walk", time: "2:00 PM" }] },
        { day: "Wednesday", events: [{ name: "Guest Speaker Event", time: "5:30 PM" }] },
        { day: "Thursday", events: [{ name: "Cooking Class", time: "3:00 PM" }] },
        { day: "Friday", events: [{ name: "Game Night", time: "7:00 PM" }] },
        { day: "Saturday", events: [{ name: "Hiking Trip", time: "9:00 AM" }] }
    ];

    // Get current week information
    const today = new Date();
    const dayOfWeek = today.getDay(); 
    const daysSinceSunday = dayOfWeek;
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysSinceSunday);

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}`;
    });

    // Search functionality for clubs
    function getMatchRank(club, query) {
        const q = query.toLowerCase();
        if (club.name.toLowerCase().includes(q)) return 1;
        if (club.description.toLowerCase().includes(q)) return 2;
        if (club.tags.some(tag => tag.toLowerCase().includes(q))) return 3;
        return 999;
    }

    // List of clubs with the given search parameters
    const filteredClubs = clubs
        .map(club => ({ ...club, rank: getMatchRank(club, search) }))
        .filter(club => club.rank !== 999)
        .sort((a, b) => a.rank - b.rank);


    return ( // 🛑 ALL JSX MUST BE RETURNED AS A SINGLE ELEMENT
        <div className="club-search-container">
            {/* 🛑 Background Image setup from your CSS */}
            {/* The CSS you provided (body::before) is designed to handle this background,
                but if you want the image as a standard element, place it here.
                I'm placing it inside a wrapper for simplicity. */}
            <div className="fixed-bg-wrapper">
                <img 
                    src={BGImage} 
                    alt="Background Image" 
                    className="BGImage" // Apply your CSS styling here
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
                />
            </div>

            <div className="app">
                {/* Home Screen Buttons */}
                <div className="home-screen">
                    <h1>Welcome to the Clubs Directory</h1>
                    <div className="home-buttons">
                        <button className="big-btn"><Calendar /> Calendar</button>
                        <button className="big-btn"><PartyPopper /> Events</button>
                        <button className="big-btn"><Users /> Clubs</button>
                    </div>
                </div>
                
                <div className="layout">
                    <div className="main-content">
                        <h2>Clubs Directory</h2>
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
                            <p>No clubs found.</p>
                        )}
                    </div>

                    {/* Fixed Weekly Calendar */}
                    <div className="fixed-calendar">
                        <h3>Weekly Calendar</h3>
                        <ul>
                            {schedule.map((d, idx) => (
                                <li key={idx} className="day-box">
                                    <strong>{d.day} - {weekDates[idx]}</strong>
                                    <ul>
                                        {d.events.map((event, i) => (
                                            <li key={i} className="event">
                                                <span className="event-name">{event.name}</span>
                                                <span className="event-time">{event.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                        <button className="calendar-btn">View Full Calendar</button>
                    </div>
                </div>
            </div>
        </div>
    );
} // 🛑 Component function closure

export default ClubSearch;