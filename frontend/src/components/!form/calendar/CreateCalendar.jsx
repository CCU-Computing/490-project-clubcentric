import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { update_club } from "../../../services/clubService";
import { create_calendar } from "../../../services/calendarService";
import '../css/CalMeet.css';
import { CreateMeetingForm } from "./CreateMeeting";
import { UpdateCalendarForm } from "./UpdateCalendar";
import { UpdateMeetingForm } from "./UpdateMeeting";

export const CreateCalendarForm = ({
  clubId,
  onClose,
  onSuccess
}) => {
  const [calendarName, setCalendarName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!calendarName.trim()) {
      setError('Calendar name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create_calendar(clubId, calendarName);

      if (!result) {
        throw new Error('Failed to create calendar');
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to create calendar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button" aria-label="Close">✕</button>
        
        <div className="modal-header">
          <h2>Create Calendar</h2>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <TextField
            label="Calendar Name"
            value={calendarName}
            onChange={setCalendarName}
            placeholder="Enter calendar name"
            required
          />

          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Creating..." : "Create Calendar"}
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="primary"
            />
            <ActionButton
              label="Cancel"
              onClick={onClose}
              disabled={isSubmitting}
              variant="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DEMO COMPONENT ====================
export default function CalendarFormsDemo() {
  const [showCreateCalendar, setShowCreateCalendar] = useState(false);
  const [showUpdateCalendar, setShowUpdateCalendar] = useState(false);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [showUpdateMeeting, setShowUpdateMeeting] = useState(false);

  const handleSuccess = (data) => {
    console.log("Operation successful:", data);
    alert("Operation completed successfully!");
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f0f4f8' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#093331' }}>
          Calendar & Meeting Forms Demo
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <ActionButton
            label="Create Calendar"
            onClick={() => setShowCreateCalendar(true)}
            variant="primary"
          />
          <ActionButton
            label="Update Calendar"
            onClick={() => setShowUpdateCalendar(true)}
            variant="primary"
          />
          <ActionButton
            label="Create Meeting"
            onClick={() => setShowCreateMeeting(true)}
            variant="secondary"
          />
          <ActionButton
            label="Update Meeting"
            onClick={() => setShowUpdateMeeting(true)}
            variant="secondary"
          />
        </div>

        <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#093331' }}>
            Background Content
          </h2>
          <p style={{ color: '#718096' }}>
            Click any button above to see the corresponding form overlay.
          </p>
        </div>
      </div>

      {showCreateCalendar && (
        <CreateCalendarForm
          clubId="123"
          onClose={() => setShowCreateCalendar(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showUpdateCalendar && (
        <UpdateCalendarForm
          calendarId="456"
          initialData={{ calendar_name: "Main Calendar" }}
          onClose={() => setShowUpdateCalendar(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showCreateMeeting && (
        <CreateMeetingForm
          calendarId="456"
          onClose={() => setShowCreateMeeting(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showUpdateMeeting && (
        <UpdateMeetingForm
          meetingId="789"
          initialData={{ description: "Weekly team meeting" }}
          onClose={() => setShowUpdateMeeting(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}