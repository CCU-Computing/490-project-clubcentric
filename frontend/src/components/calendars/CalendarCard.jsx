import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import { listMeetings } from '../../services/calendarService';

function CalendarCard({ calendar }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchMeetings() {
      const data = await listMeetings(calendar.id, null);
      if (data) {
        setEvents(data.map(m => ({
          title: m.title || 'Meeting',
          date: m.date // FullCalendar accepts ISO strings
        })));
      }
    }
    fetchMeetings();
  }, [calendar.id]);

  return (
    <div className="calendar-card">
      <h3>{calendar.name}</h3>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={400}
      />
    </div>
  );
}

export default CalendarCard;
