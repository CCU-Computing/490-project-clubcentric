import { useEffect, useState } from "react";
import { get_meetings } from "../../services/calendarService";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarCard({ calendar }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchMeetings() {
      console.log(calendar)
      const data = await get_meetings(calendar.id, null);
      if (data) {
        setEvents(
          data.map((m) => ({
            title: m.title || "Meeting",
            date: m.date,
            backgroundColor: "#2f7b21ff", // blue for this calendar
            borderColor: "#1c3050ff",
          }))
        );
      }
    }
    fetchMeetings();
  }, [calendar]);

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
