import { useState, useEffect } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Calendar, ChevronDown, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import CalendarCard from "./CalendarCard";
import { 
  get_calendars, 
  get_meetings, 
  create_calendar, 
  update_calendar,
  create_meeting,
  update_meeting,
  delete_calendar,
  delete_meeting
} from '../../services/calendarService';

export default function CalendarSelector({ clubId = null }) {
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingCalendars, setLoadingCalendars] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  
  // Modal states
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [showEditCalendar, setShowEditCalendar] = useState(false);
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // 'calendar' or 'meeting-{id}'
  
  // Form states
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDesc, setMeetingDesc] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [editingMeetingId, setEditingMeetingId] = useState(null);

  // Fetch calendars on mount
  useEffect(() => {
    fetchCalendars();
  }, [clubId]);

  // Fetch meetings when selected calendar changes
  useEffect(() => {
    if (selectedCalendarId) {
      fetchMeetings();
    }
  }, [selectedCalendarId]);

  async function fetchCalendars() {
    setLoadingCalendars(true);
    const data = await get_calendars(clubId);
    if (data && data.length > 0) {
      setCalendars(data);
      setSelectedCalendarId(data[0].id);
    } else {
      setCalendars([]);
      setSelectedCalendarId(null);
    }
    setLoadingCalendars(false);
  }

  async function fetchMeetings() {
    setLoadingEvents(true);
    const data = await get_meetings(selectedCalendarId);
    setEvents(data || []);
    setLoadingEvents(false);
  }

  async function handleCreateCalendar() {
    if (!calendarName.trim()) return;
    const result = await create_calendar(clubId, calendarName);
    if (result) {
      await fetchCalendars();
      setCalendarName('');
      setShowCreateCalendar(false);
    }
  }

  async function handleUpdateCalendar() {
    if (!calendarName.trim()) return;
    const result = await update_calendar(selectedCalendarId, calendarName);
    if (result) {
      await fetchCalendars();
      setCalendarName('');
      setShowEditCalendar(false);
    }
  }

  async function handleDeleteCalendar() {
    const result = await delete_calendar(selectedCalendarId);
    if (result) {
      await fetchCalendars();
      setShowDeleteConfirm(null);
    }
  }

  async function handleCreateMeeting() {
    if (!meetingDate || !meetingTime || !meetingDesc.trim()) return;
    const datetime_str = `${meetingDate}T${meetingTime}`;
    const result = await create_meeting(selectedCalendarId, datetime_str, meetingDesc);
    if (result) {
      await fetchMeetings();
      setMeetingDate('');
      setMeetingTime('');
      setMeetingDesc('');
      setShowCreateMeeting(false);
    }
  }

  async function handleUpdateMeeting() {
    if (!meetingDesc.trim() || !editingMeetingId) return;
    const result = await update_meeting(editingMeetingId, meetingDesc);
    if (result) {
      await fetchMeetings();
      setMeetingDesc('');
      setEditingMeetingId(null);
    }
  }

  async function handleDeleteMeeting(meetingId) {
    const result = await delete_meeting(meetingId);
    if (result) {
      await fetchMeetings();
      setShowDeleteConfirm(null);
    }
  }

  function handleEventClick(info) {
    const meetingId = info.event.id;
    setEditingMeetingId(meetingId);
    setMeetingDesc(info.event.title);
  }

  const selectedCalendar = calendars.find(cal => cal.id === selectedCalendarId);


  if (loadingCalendars) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Selector & Management */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-6 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <label htmlFor="calendar-select" className="text-sm font-semibold text-gray-700">
              Select Calendar
            </label>
          </div>
          <button
            onClick={() => setShowCreateCalendar(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Calendar
          </button>
        </div>

        {calendars.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No calendars available</p>
            <p className="text-gray-500 text-sm mt-2">Create a calendar to get started</p>
          </div>
        ) : (
          <>
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

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setCalendarName(selectedCalendar?.name || '');
                  setShowEditCalendar(true);
                }}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit Name
              </button>
              <button
                onClick={() => setShowDeleteConfirm('calendar')}
                className="flex items-center gap-1 px-3 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete Calendar
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-3">
              Showing {clubId ? 'club' : 'your'} calendars
            </p>
          </>
        )}
      </div>

      {/* Meeting Management */}
      {selectedCalendar && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Meeting Management</h3>
            <button
              onClick={() => setShowCreateMeeting(true)}
              className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Meeting
            </button>
          </div>

          {editingMeetingId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Edit Meeting Description</label>
                <button
                  onClick={() => {
                    setEditingMeetingId(null);
                    setMeetingDesc('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={meetingDesc}
                onChange={(e) => setMeetingDesc(e.target.value)}
                placeholder="Meeting description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateMeeting}
                  className="flex items-center gap-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Update Meeting
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(`meeting-${editingMeetingId}`)}
                  className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Meeting
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar Display */}
      {selectedCalendar && (
        <CalendarCard
          calendar={selectedCalendar}
          events={events}
          loading={loadingEvents}
          onEventClick={handleEventClick}
        />
      )}

      {/* Create Meeting Modal */}
      {showCreateMeeting && (
        <Modal onClose={() => setShowCreateMeeting(false)} title="Create New Meeting">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={meetingDesc}
                onChange={(e) => setMeetingDesc(e.target.value)}
                placeholder="Enter meeting description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <button
              onClick={handleCreateMeeting}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Meeting
            </button>
          </div>
        </Modal>
      )}

      {/* Create Calendar Modal */}
      {showCreateCalendar && (
        <Modal onClose={() => setShowCreateCalendar(false)} title="Create New Calendar">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Name</label>
              <input
                type="text"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                placeholder="Enter calendar name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreateCalendar}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Calendar
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Calendar Modal */}
      {showEditCalendar && (
        <Modal onClose={() => setShowEditCalendar(false)} title="Edit Calendar Name">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calendar Name</label>
              <input
                type="text"
                value={calendarName}
                onChange={(e) => setCalendarName(e.target.value)}
                placeholder="Enter calendar name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleUpdateCalendar}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Calendar
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(null)} title="Confirm Deletion">
          <div className="space-y-4">
            <p className="text-gray-700">
              {showDeleteConfirm === 'calendar' 
                ? 'Are you sure you want to delete this calendar? All meetings will be deleted as well. This action cannot be undone.'
                : 'Are you sure you want to delete this meeting? This action cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (showDeleteConfirm === 'calendar') {
                    handleDeleteCalendar();
                  } else {
                    const meetingId = showDeleteConfirm.split('-')[1];
                    handleDeleteMeeting(meetingId);
                  }
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}