import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { update_meeting, delete_meeting } from "../../../services/calendarService";
import "../css/CalMeet.css";

export const UpdateMeetingForm = ({
  meetingId,
  initialData = {},
  onClose,
  onSuccess,
  onDelete
}) => {
  const [description, setDescription] = useState(initialData.description || '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await update_meeting(meetingId, description);

      if (!result) {
        throw new Error('Failed to update meeting');
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to update meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await delete_meeting(meetingId);

      if (!result) {
        throw new Error('Failed to delete meeting');
      }

      if (onDelete) onDelete(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to delete meeting');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button onClick={onClose} className="close-button" aria-label="Close">✕</button>
        
        <div className="modal-header">
          <h2>Update Meeting</h2>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Leave blank to keep current"
              rows={4}
              className="form-textarea"
            />
          </div>

          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Updating..." : "Update Meeting"}
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
                label="Delete Meeting"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                variant="danger"
              />
            ) : (
              <div className="delete-confirm">
                <p className="delete-warning">
                  Are you sure you want to delete this meeting? This action cannot be undone.
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