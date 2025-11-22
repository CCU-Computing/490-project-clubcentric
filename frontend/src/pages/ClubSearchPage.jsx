import React, { useState, useEffect } from 'react';
import { getClubs } from '../services/clubService';
import '../components/ClubSearch.css';

function ClubSearchPage() {
    const [clubs, setClubs] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getClubs().then(data => {
            if (data) setClubs(data);
        });
    }, []);

    function isValidUrl(string) {
        try {
            return new URL(string) && (string.startsWith('http://') || string.startsWith('https://'));
        } catch (e) {
            if (string.includes('youtube.com') || string.includes('youtu.be')) {
                return true;
            }
            return false;
        }
    }

    function getMatchRank(club, query) {
        const q = query.toLowerCase();
        if (club.name.toLowerCase().includes(q)) return 1;
        if (club.description.toLowerCase().includes(q)) return 2;
        if (club.tags && club.tags.some(tag => tag.toLowerCase().includes(q))) return 3;
        return 999;
    }

    function extractVideoUrl(embedString) {
        if (!embedString) return '';
        const match = embedString.match(/src="(.+?)"/);
        return match ? match[1] : embedString;
    }

    const filteredClubs = clubs
        .map(club => ({ ...club, rank: getMatchRank(club, search) }))
        .filter(club => club.rank !== 999)
        .sort((a, b) => a.rank - b.rank);

    return (
        <div className="club-search-container">
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
                                <div className="tags">
                                {club.tags && club.tags.map((tag, i) => (
                                        <span key={i} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <p>{club.description}</p>
                                
                                { (club.videoEmbed && isValidUrl(extractVideoUrl(club.videoEmbed))) && (
                                    <iframe
                                        width="950"
                                        height="534"
                                        src={extractVideoUrl(club.videoEmbed)}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        style={{ backgroundColor: 'white' }}
                                    ></iframe>
                                )}
                                
                                <p></p>
                                <a href={`/club/${club.id}`}>Visit Page →</a>
                            </div>
                        ))
                    ) : (
                        <div className="no-clubs">
                            {search ? 'No clubs found matching your search.' : 'No clubs available.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ClubSearchPage;