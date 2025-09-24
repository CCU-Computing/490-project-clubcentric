import { useEffect, useState } from "react";
import calendarService from "../../services/calendarService";
import api from "../../services/api"
export default function CalendarModule({ clubId }) {
  const [meetings, setMeetings] = useState([]);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    if (!clubId) return;

    const fetchCalendar = async () => {
        try {
        const res = await api.get(`/calendars/?club_id=${clubId}`);
        setMeetings(res.data.meetings);
        } catch (err) {
        console.error(err);
        }
    };

    fetchCalendar();
    }, [clubId]);
  return (
    <div>
      <h3>Calendar</h3>
      <ul>
        {meetings.map((m, i) => (
          <li key={i}>{new Date(m.date).toLocaleString()}</li>
        ))}
      </ul>
      <input
        type="datetime-local"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button onClick={addMeeting}>Add Meeting</button>
    </div>
  );
}
