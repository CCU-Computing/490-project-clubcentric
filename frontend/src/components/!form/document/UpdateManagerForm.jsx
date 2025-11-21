import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { ActionButton } from "../../!base/ActionButton";
import { update_manager, delete_manager } from "../../../services/documentService";
import "../css/DocumentForms.css";

export const UpdateManagerForm = ({
  onClose,
  onSuccess,
  onDelete,
  managerId,
  initialName
}) => {
  const [formData, setFormData] = useState({
    name: initialName || '',
    manager_id: managerId || ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Manager name is required');
      return;
    }

    if (!formData.manager_id) {
      setError('Manager ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await update_manager(formData.manager_id, formData.name);

      if (!result) {
        throw new Error('Failed to update document manager');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to update document manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const result = await delete_manager(formData.manager_id);

      if (!result) {
        throw new Error('Failed to delete document manager');
      }

      // Success - call onDelete callback and close
      if (onDelete) onDelete(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to delete document manager');
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Form Header */}
        <div className="modal-header">
          <h2>Update Document Manager</h2>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <TextField
            label="Manager ID"
            value={formData.manager_id}
            onChange={(val) => updateField('manager_id', val)}
            placeholder="Enter manager ID"
            required
            disabled={!!managerId}
          />

          <TextField
            label="Manager Name"
            value={formData.name}
            onChange={(val) => updateField('name', val)}
            placeholder="Enter manager name"
            required
          />

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Updating..." : "Update Manager"}
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
                label="Delete Manager"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                variant="danger"
              />
            ) : (
              <div className="delete-confirm">
                <p className="delete-warning">
                  Are you sure you want to delete this manager? This action cannot be undone.
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

export default UpdateManagerForm;
