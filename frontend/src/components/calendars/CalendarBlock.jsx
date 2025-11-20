import { useEffect, useState } from "react";
import { get_calendars } from "../../services/calendarService"; // adjust path if needed

export default function CalendarBlock({ clubId }) {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    get_calendars(clubId).then((data) => {
      if (data) setCalendars(data);
    });
  }, [clubId]);

  return (
    <div>
      <h3>Calendars</h3>
      {calendars.length === 0 ? (
        <p>No calendars yet.</p>
      ) : (
        <ul>
          {calendars.map((cal) => (
            <li key={cal.id}>{cal.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
