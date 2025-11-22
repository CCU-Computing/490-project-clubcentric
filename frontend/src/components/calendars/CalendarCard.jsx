import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarCard({ calendar, events, loading, onEventClick }) {
  return (
    <div className="calendar-card">
      <h3 className="text-xl font-semibold mb-4">{calendar.name}</h3>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading meetings...</p>
        </div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          height={450}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          eventClick={(info) => {
            onEventClick(info);
          }}
        />
      )}
    </div>
  );
}