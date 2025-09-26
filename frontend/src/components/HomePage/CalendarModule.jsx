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
  const addMeeting = async () => {
    if (!newDate) return;

    try {
        const res = await calendarService.addMeeting(clubId, newDate);
        setMeetings(prev => [...prev, res.data]); // append new meeting
        setNewDate(""); // clear input
    } catch (err) {
        console.error(err);
    }
    };


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
