// components/ClubContent.jsx
import { useEffect, useState } from "react";
import { getClubs } from "../../services/clubService";
import CalendarCard from "../calendars/CalendarCard";
import DocumentBlock from "../documents/DocumentBlock";
import { listCalendars } from "../../services/calendarService";

export default function ClubContent({ clubId }) {
  const [club, setClub] = useState(null);
  const [calendars, setCalendars] = useState([]);
  

  useEffect(() => {
    getClubs(clubId).then((data) => setClub(data));
  }, [clubId]);

  useEffect(() => {
    listCalendars(clubId).then((data) => {
      if (data) setCalendars(data);
    });
  }, [clubId]);

  if (!club) return <p>Loading...</p>;

  return (
    <div>
      <h2>{club.name}</h2>
      <p>{club.description}</p>

     
      <h3>Calendar</h3>
      {calendars.length === 0 ? (
        <p>No calendars available.</p>
      ) : (
        calendars.map((cal) => (
          <CalendarCard key={cal.id} calendar={cal} />
        ))
      )}

      <h3 className="text-xl font-semibold mt-4">Documents</h3>
      <DocumentBlock club_id={clubId} />
    </div>
  );
}

// 
