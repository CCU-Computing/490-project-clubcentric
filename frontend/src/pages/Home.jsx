// pages/Home.jsx
import { useEffect, useState } from "react";
import ClubForm from "../components/HomePage/ClubForm";
import CalendarModule from "../components/HomePage/CalendarModule";
import DocumentModule from "../components/HomePage/DocumentModule";
import api from "../services/api"

export default function Home() {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get("/clubs/");
        setClubs(response.data);
        if (response.data.length > 0) setSelectedClub(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch clubs:", error);
      }
    };
    fetchClubs();
  }, []);

  const handleCreateClub = async (newClubData) => {
    try {
      const response = await api.post("/clubs/", newClubData);
      const createdClub = response.data;
      setClubs((prev) => [...prev, createdClub]);
      setSelectedClub(createdClub);
    } catch (error) {
      console.error("Failed to create club:", error);
    }
  };

  return (
    <div>
      <h1>Club Dashboard</h1>

      <ClubForm onCreate={handleCreateClub} />

      <ul>
        {clubs.map((club) => (
          <li key={club.slug_id} onClick={() => setSelectedClub(club)}>
            {club.name}
          </li>
        ))}
      </ul>

      {selectedClub && (
        <div>
          <h2>{selectedClub.name}</h2>
          <CalendarModule clubId={selectedClub.slug_id} />
          <DocumentModule clubId={selectedClub.slug_id} />
        </div>
      )}
    </div>
  );
}
