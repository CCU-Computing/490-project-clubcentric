import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs } from "../services/clubService";

export default function ClubsPage() {
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
    <div className="bg-blue-50 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Clubs</h1>
      <ul className="w-full max-w-md space-y-3">
        {clubs.map((club) => (
          <li
            key={club.id}
            onClick={() => goToClub(club.id)}
            className="p-4 bg-white rounded-lg shadow hover:bg-red-500 cursor-pointer transition-colors duration-200"
          >
            {club.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
