import { useEffect, useState } from "react";
import { listCalendars } from "../../services/calendarService";
import CalendarCard from "./CalendarCard";

export default function ClubCalendars({ club_id }) {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    async function fetchCalendars() {
      const data = await listCalendars(club_id);
      if (data) setCalendars(data);
    }
    fetchCalendars();
  }, [club_id]);

  if (!calendars.length) return <p>No calendars found for this club.</p>;

  return (
    <div className="club-calendars">
      {calendars.map((cal) => (
        <CalendarCard key={cal.id} calendar={cal} />
      ))}
    </div>
  );
}
