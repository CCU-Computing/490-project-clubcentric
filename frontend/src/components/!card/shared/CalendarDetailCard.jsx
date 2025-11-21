import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActionButton } from "../../!base/ActionButton";
import { get_meetings, delete_meeting } from "../../../services/calendarService";
import { CreateMeetingForm } from "../../!form/calendar/CreateMeeting";
import { UpdateMeetingForm } from "../../!form/calendar/UpdateMeeting";
import "../css/Cards.css";

export const CalendarDetailCard = ({
  calendar,
  canEdit = false,
  onBack
}) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [deletingMeetingId, setDeletingMeetingId] = useState(null);

  useEffect(() => {
    if (calendar?.id) {
      fetchMeetings();
    }
  }, [calendar]);

  const fetchMeetings = async () => {
    setLoading(true);
    setError('');

    try {
      const meetingData = await get_meetings(calendar.id);
      if (!meetingData) {
        // Set empty array instead of error for missing data
        setMeetings([]);
      } else {
        setMeetings(Array.isArray(meetingData) ? meetingData : [meetingData]);
      }
    } catch (err) {
      // Handle 404 gracefully - just means no meetings yet
      if (err.response?.status === 404) {
        setMeetings([]);
        setError('');
      } else {
        setError('Unable to load meetings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (meetingId) => {
    setError('');

    try {
      const result = await delete_meeting(meetingId);
      if (!result) {
        throw new Error('Failed to delete meeting');
      }

      // Remove from local state
      setMeetings(prev => prev.filter(meet => meet.id !== meetingId));
      setDeletingMeetingId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete meeting');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading meetings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{calendar.calendar_name}</h2>
            <p className="card-subtitle">Meetings</p>
          </div>
          <div className="card-actions">
            {onBack && (
              <ActionButton
                label="← Back"
                onClick={onBack}
                variant="secondary"
              />
            )}
            {canEdit && (
              <ActionButton
                label="Add Meeting"
                onClick={() => setShowCreateForm(true)}
                variant="primary"
              />
            )}
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="card-error">
              <p>{error}</p>
            </div>
          )}

          {meetings.length === 0 ? (
            <div className="empty-state">
              <p>No meetings scheduled</p>
              {canEdit && <p>Click "Add Meeting" to schedule one</p>}
            </div>
          ) : (
            <div className="calendar-container">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={meetings.map(meeting => ({
                  id: meeting.id,
                  title: meeting.description || 'Meeting',
                  start: meeting.date,
                  extendedProps: {
                    meetingData: meeting
                  }
                }))}
                eventClick={(info) => {
                  if (canEdit) {
                    setEditingMeeting(info.event.extendedProps.meetingData);
                  }
                }}
                editable={canEdit}
                selectable={canEdit}
                height="auto"
              />
            </div>
          )}
        </div>
      </div>

      {showCreateForm && (
        <CreateMeetingForm
          calendarId={calendar.id}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchMeetings();
          }}
        />
      )}

      {editingMeeting && (
        <UpdateMeetingForm
          meetingId={editingMeeting.id}
          initialData={editingMeeting}
          onClose={() => setEditingMeeting(null)}
          onSuccess={() => {
            setEditingMeeting(null);
            fetchMeetings();
          }}
          onDelete={() => {
            setEditingMeeting(null);
            fetchMeetings();
          }}
        />
      )}
    </>
  );
};

export default CalendarDetailCard;
