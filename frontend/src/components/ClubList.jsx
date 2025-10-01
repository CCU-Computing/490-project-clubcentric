import { useEffect, useState } from "react";
import { getClubs } from "../services/clubService.js";

export default function ClubList() {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getClubs().then(data => {
      if (data) setClubs(data);
    });
  }, []);

  return (
    <div>
      <h2>Clubs</h2>
      <ul>
        {clubs.map(club => (
          <li key={club.id}>{club.name}</li>
        ))}
      </ul>
    </div>
  );
}
