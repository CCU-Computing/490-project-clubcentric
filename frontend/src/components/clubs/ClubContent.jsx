import { useEffect, useState } from "react";
import { get_club } from "../../services/clubService";
import CalendarCard from "../calendars/CalendarCard";
import DocumentBlock from "../documents/DocumentBlock";
import { get_calendars } from "../../services/calendarService";
import EditClubModal from "../clubs/EditClubModal";
import { update_club } from "../../services/clubService";
import { Button } from "@mui/material";

export default function ClubContent({ clubId }) {
  const [club, setClub] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    get_club(clubId).then((data) => setClub(data));
  }, [clubId]);

  useEffect(() => {
    get_calendars(clubId).then((data) => {
      if (data) setCalendars(data);
    });
  }, [clubId]);

  function extractVideoUrl(embedString) {
    if (!embedString) return '';
    const match = embedString.match(/src="(.+?)"/);
    return match ? match[1] : embedString;
  }

  function isValidUrl(string) {
    try {
      return new URL(string) && (string.startsWith('http://') || string.startsWith('https://'));
    } catch (e) {
      if (string.includes('youtube.com') || string.includes('youtu.be')) return true;
      return false;
    }
  }

  if (!club) return <p>Loading...</p>;

  const handleUpdateClub = async (updatedData) => {
    try {
      await update_club(
        updatedData.club_id,
        updatedData.name,
        updatedData.description,
        updatedData.picture,
        updatedData.links,
        updatedData.summary,
        updatedData.videoEmbed,
        updatedData.tags,
        updatedData.lastMeetingDate
      );
      // Refresh club data
      const refreshed = await get_club(clubId);
      setClub(refreshed);
      setIsEditOpen(false);
    } catch (err) {
      console.error("Error updating club:", err);
      throw err;
    }
  };

  return (
    <div>
      <h2>{club.name}</h2>
      <p>{club.description}</p>
      <p>{club.summary}</p>
      <p>Last Meeting Date: {club.lastMeetingDate}</p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '15px',
          marginBottom: '15px',
        }}
      >
        {club.tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#333',
              padding: '5px 10px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600',
              border: '1px solid #ddd',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {club.videoEmbed && isValidUrl(extractVideoUrl(club.videoEmbed)) && (
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
        calendars.map((cal) => <CalendarCard key={cal.id} calendar={cal} />)
      )}

      <h3 className="text-xl font-semibold mt-4">Documents</h3>
      <DocumentBlock club_id={clubId} />

      {/* Edit Button */}
      <div style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsEditOpen(true)}
        >
          Edit Club
        </Button>
      </div>

      {/* Edit Modal */}
      {isEditOpen && (
        <EditClubModal
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          club={club}
          onUpdateClub={handleUpdateClub}
        />
      )}
    </div>
  );
}
