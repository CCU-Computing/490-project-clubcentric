import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs } from "../services/clubService";

export default function Home() {
  const [clubs, setClubs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getClubs().then(data => {
      if (data) setClubs(data);
    });
  }, []);

  const goToClub = (id) => {
    navigate(`/club/${id}`);
  };

  return (
    <div>
      <h1>Clubs</h1>
      <ul>
        {clubs.map(club => (
          <li key={club.id} onClick={() => goToClub(club.id)} style={{ cursor: "pointer" }}>
            {club.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
