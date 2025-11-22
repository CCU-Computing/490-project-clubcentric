import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_calendars, delete_calendar } from "../../../services/calendarService";
import { CreateCalendarForm } from "../../!form/calendar/CreateCalendar";
import { UpdateCalendarForm } from "../../!form/calendar/UpdateCalendar";
import "../css/Cards.css";

export const UserCalendarCard = ({
  userId,
  currentUserId,
  onSelectCalendar
}) => {
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [deletingCalendarId, setDeletingCalendarId] = useState(null);

  useEffect(() => {
    fetchCalendarData();
  }, [userId]);

  const fetchCalendarData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get user's calendars (pass null to get current user's calendars)
      const calendarData = await get_calendars(null);
      if (!calendarData) {
        // Set empty array instead of error for missing data
        setCalendars([]);
      } else {
        setCalendars(Array.isArray(calendarData) ? calendarData : [calendarData]);
      }
    } catch (err) {
      // Handle 404 gracefully - just means no calendars yet
      if (err.response?.status === 404) {
        setCalendars([]);
        setError('');
      } else {
        setError('Unable to load calendars. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (calendarId) => {
    setError('');

    try {
      const result = await delete_calendar(calendarId);
      if (!result) {
        throw new Error('Failed to delete calendar');
      }

      // Remove from local state
      setCalendars(prev => prev.filter(cal => cal.id !== calendarId));
      setDeletingCalendarId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete calendar');
    }
  };

  // User can only edit their own calendars
  const isOwner = !userId || userId === currentUserId;

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading calendars...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">My Calendars</h2>
          {isOwner && (
            <div className="card-actions">
              <ActionButton
                label="Add Calendar"
                onClick={() => setShowCreateForm(true)}
                variant="primary"
              />
            </div>
          )}
        </div>

        <div className="card-body">
          {error && (
            <div className="card-error">
              <p>{error}</p>
            </div>
          )}

          {calendars.length === 0 ? (
            <div className="empty-state">
              <p>No calendars yet</p>
              {isOwner && <p>Click "Add Calendar" to create one</p>}
            </div>
          ) : (
            <ul className="card-list">
              {calendars.map((calendar) => (
                <li key={calendar.id} className="card-list-item">
                  <div className="list-item-content">
                    <h3 className="list-item-title">{calendar.calendar_name}</h3>
                    <p className="list-item-subtitle">
                      Calendar ID: {calendar.id}
                    </p>
                  </div>

                  <div className="list-item-actions">
                    <ActionButton
                      label="View Meetings"
                      onClick={() => onSelectCalendar && onSelectCalendar(calendar)}
                      variant="primary"
                    />
                    {isOwner && (
                      <>
                        <ActionButton
                          label="Edit"
                          onClick={() => setEditingCalendar(calendar)}
                          variant="secondary"
                        />
                        {deletingCalendarId === calendar.id ? (
                          <>
                            <ActionButton
                              label="Confirm"
                              onClick={() => handleDelete(calendar.id)}
                              variant="danger"
                            />
                            <ActionButton
                              label="Cancel"
                              onClick={() => setDeletingCalendarId(null)}
                              variant="secondary"
                            />
                          </>
                        ) : (
                          <ActionButton
                            label="Delete"
                            onClick={() => setDeletingCalendarId(calendar.id)}
                            variant="danger"
                          />
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showCreateForm && (
        <CreateCalendarForm
          clubId={null}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchCalendarData();
          }}
        />
      )}

      {editingCalendar && (
        <UpdateCalendarForm
          calendarId={editingCalendar.id}
          initialData={editingCalendar}
          onClose={() => setEditingCalendar(null)}
          onSuccess={() => {
            setEditingCalendar(null);
            fetchCalendarData();
          }}
          onDelete={() => {
            setEditingCalendar(null);
            fetchCalendarData();
          }}
        />
      )}
    </>
  );
};

export default UserCalendarCard;
