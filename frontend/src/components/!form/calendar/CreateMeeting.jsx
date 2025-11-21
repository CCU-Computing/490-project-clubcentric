import { useState } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { create_meeting } from "../../../services/calendarService";

export const CreateMeetingForm = ({ 
  calendarId,
  onClose,
  onSuccess 
}) => {
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!datetime) {
      setError('Date and time are required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create_meeting(calendarId, datetime, description);

      if (!result) {
        throw new Error('Failed to create meeting');
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to create meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button" aria-label="Close">✕</button>
        
        <div className="modal-header">
          <h2>Create Meeting</h2>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">
              Meeting Date & Time <span className="required">*</span>
            </label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting description"
              rows={4}
              required
              className="form-textarea"
            />
          </div>

          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Creating..." : "Create Meeting"}
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