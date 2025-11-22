
import { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar, ChevronDown } from 'lucide-react';
import CalendarCard from "./CalendarCard";
import { get_calendars, get_meetings } from '../../services/calendarService';

// Main CalendarSelector component
export default function CalendarSelector({ clubId = null }) {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingCalendars, setLoadingCalendars] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch calendars on mount
  useEffect(() => {
    async function fetchCalendars() {
      setLoadingCalendars(true);
      const data = await get_calendars(clubId);
      if (data && data.length > 0) {
        setCalendars(data);
        setSelectedCalendarId(data[0].id); // Select first calendar by default
      }
      setLoadingCalendars(false);
    }
    fetchCalendars();
  }, [clubId]);

  // Fetch meetings when selected calendar changes
  useEffect(() => {
    async function fetchMeetings() {
      if (selectedCalendarId) {
        setLoadingEvents(true);
        const data = await get_meetings(selectedCalendarId);
        setEvents(data || []);
        setLoadingEvents(false);
      }
    }
    fetchMeetings();
  }, [selectedCalendarId]);

  const selectedCalendar = calendars.find(cal => cal.id === selectedCalendarId);

  if (loadingCalendars) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (calendars.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No calendars available</p>
        <p className="text-gray-500 text-sm mt-2">Create a calendar to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <label htmlFor="calendar-select" className="text-sm font-semibold text-gray-700">
            Select Calendar
          </label>
        </div>
        <div className="relative">
          <select
            id="calendar-select"
            value={selectedCalendarId || ''}
            onChange={(e) => setSelectedCalendarId(Number(e.target.value))}
            className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 font-medium"
          >
            {calendars.map((calendar) => (
              <option key={calendar.id} value={calendar.id}>
                {calendar.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Showing {clubId ? 'club' : 'your'} calendars
        </p>
      </div>

      {/* Calendar Display */}
      {selectedCalendar && (
        <CalendarCard
          calendar={selectedCalendar}
          events={events}
          loading={loadingEvents}
        />
      )}
    </div>
  );
}