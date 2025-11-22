import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { update_calendar, delete_calendar } from "../../../services/calendarService";
import "../css/CalMeet.css";

export const UpdateCalendarForm = ({
  calendarId,
  initialData = {},
  onClose,
  onSuccess,
  onDelete
}) => {
  const [calendarName, setCalendarName] = useState(initialData.calendar_name || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await update_calendar(calendarId, calendarName);

      if (!result) {
        throw new Error('Failed to update calendar');
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to update calendar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await delete_calendar(calendarId);

      if (!result) {
        throw new Error('Failed to delete calendar');
      }

      if (onDelete) onDelete(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to delete calendar');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button" aria-label="Close">✕</button>
        
        <div className="modal-header">
          <h2>Update Calendar</h2>
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
            placeholder="Leave blank to keep current"
          />

          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Updating..." : "Update Calendar"}
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

          {/* Delete Section */}
          <div className="delete-section">
            {!showDeleteConfirm ? (
              <ActionButton
                label="Delete Calendar"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                variant="danger"
              />
            ) : (
              <div className="delete-confirm">
                <p className="delete-warning">
                  Are you sure you want to delete this calendar? This action cannot be undone.
                </p>
                <div className="button-group">
                  <ActionButton
                    label={isSubmitting ? "Deleting..." : "Confirm Delete"}
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    variant="danger"
                  />
                  <ActionButton
                    label="Cancel"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isSubmitting}
                    variant="secondary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};