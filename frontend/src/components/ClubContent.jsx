// components/ClubContent.jsx
import { useEffect, useState } from "react";
import { getClubs } from "../services/clubService";
import CalendarBlock from "./calendars/CalendarBlock";
import DocumentBlock from "./documents/DocumentBlock";

export default function ClubContent({ clubId }) {
  const [club, setClub] = useState(null);
  

  useEffect(() => {
    getClubs(clubId).then((data) => setClub(data));
  }, [clubId]);

  if (!club) return <p>Loading...</p>;

  return (
    <div>
      <h2>{club.name}</h2>
      <p>{club.description}</p>

      <h3>Calendar</h3>
      <CalendarBlock club_id={clubId} />

      <h3>Documents</h3>
      <DocumentBlock club_id={clubId} />
    </div>
  );
}
