import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  function AppWebpage() {

    // Club data (TO BE REPLACED WITH CODE ACCESSING  AN SQL DATABASE LATER ON!!!).
    const clubs = [
  {
    name: "Chess Enthusiasts Club",
    description: "For lovers of strategy and competition.",
    tags: ["board games", "strategy", "tournaments"],
    page: "chess.html"
  },
  {
    name: "Space Exploration Society",
    description: "Discuss the universe, astronomy, and rockets.",
    tags: ["science", "astronomy", "NASA"],
    page: "space.html"
  },
  {
    name: "Cooking Adventures",
    description: "Experiment with recipes and share delicious food.",
    tags: ["food", "recipes", "baking"],
    page: "cooking.html"
  },
  {
    name: "Photography Circle",
    description: "Capture beautiful moments and learn camera skills.",
    tags: ["art", "cameras", "editing"],
    page: "photography.html"
  },
  {
    name: "Hiking & Outdoors Club",
    description: "Explore trails, mountains, and the great outdoors.",
    tags: ["nature", "fitness", "travel"],
    page: "hiking.html"
  },
  {
    name: "Esports Alliance",
    description: "Competitive gaming community for all skill levels.",
    tags: ["gaming", "tournaments", "teamwork"],
    page: "esports.html"
  },
  {
    name: "Music Makers Guild",
    description: "Collaborate on music projects and jam sessions.",
    tags: ["instruments", "band", "performance"],
    page: "music.html"
  },
  {
    name: "Creative Writing Club",
    description: "Share stories, poetry, and sharpen your writing skills.",
    tags: ["literature", "storytelling", "poetry"],
    page: "writing.html"
  },
  {
  name: "Cultural Foodies",
  description: "Discover and share traditional dishes from around the world.",
  tags: ["food", "culture", "recipes", "cooking"],
  page: "foodies.html"
}

];


    const [search, setSearch] = React.useState("");

    // Function to generate clubs when searching in order of Name, Description, and tags.
    function getMatchRank(club, query) {
        const q = query.toLowerCase();

            // Check if there is a club with a name that is in the search bar.
            if (club.name.toLowerCase().includes(q)) return 1;

            // Check if there is a club with a description that is in the search bar.
            if (club.description.toLowerCase().includes(q)) return 2;

            // Check if there is a club with a tag that is in the search bar.
            if (club.tags.some(tag => tag.toLowerCase().includes(q))) return 3;

            // Check if there are no matches.
            return 999;
    }
    // Places the clubs onto the "new" webpage in the required order.
    const filteredClubs = clubs
        .map(club => ({ ...club, rank: getMatchRank(club, search) }))
        .filter(club => club.rank !== 999)
        .sort((a, b) => a.rank - b.rank);

    // Creates the "new" webpage after typing in the search bar.
      // "Input" (lines 55 - 60) adds searchbar functionality.
      // Lines 61 - 76 Add the filters that help the user to search for what they are looking for.
    return (
    <div className="app">
      <h2>Search Clubs</h2>
      <input
        type="text"
        placeholder="Type to search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
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
  );
}

  return (
    <div>
      <div id="root"></div>

      <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  </div>
  );
}

export default App
