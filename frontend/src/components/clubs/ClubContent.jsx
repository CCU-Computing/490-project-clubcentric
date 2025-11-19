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

  function extractVideoUrl(embedString) {
    if (!embedString) return '';
    const match = embedString.match(/src="(.+?)"/);
    return match ? match[1] : embedString; // if no match, assume it's already a URL
}

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

  if (!club) return <p>Loading...</p>;

  
  return (
    <div>
      <h2>{club.name}</h2>
      <p>{club.description}</p>
      <p>{club.summary}</p>
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
