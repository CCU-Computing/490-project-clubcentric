import { useEffect, useState } from "react";
import { getClubs } from "../services/clubService"; 
import { listCalendars } from "../services/calendarService";
import CalendarCard from "../components/calendars/CalendarCard";
import { useNavigate, useParams } from "react-router-dom";

export default function ClubPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // <- for programmatic navigation
  const [club, setClub] = useState(null);
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    getClubs(id).then((data) => setClub(data));
  }, [id]);

  useEffect(() => {
    listCalendars(id).then((data) => {
      if (data) setCalendars(data);
    });
  }, [id]);

  if (!club) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate("/")}>Home</button> {/* Home button */}

      <h2>{club.name}</h2>
      <p>{club.description}</p>

      <h2>Calendars</h2>
      {calendars.map((cal) => (
        <CalendarCard key={cal.id} calendar={cal} />
      ))}
    </div>
  );
}
