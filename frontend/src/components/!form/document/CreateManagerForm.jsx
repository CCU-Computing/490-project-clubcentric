import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { ActionButton } from "../../!base/ActionButton";
import { create_manager } from "../../../services/documentService";
import "../css/DocumentForms.css";

export const CreateManagerForm = ({
  onClose,
  onSuccess,
  clubId
}) => {
  const [formData, setFormData] = useState({
    name: '',
    club_id: clubId || ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Manager name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use clubId from props (can be null for user managers)
      const result = await create_manager(formData.name, clubId || null);

      if (!result) {
        throw new Error('Failed to create document manager');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to create document manager');
    } finally {
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
          <h2>Create Document Manager</h2>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

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
              label={isSubmitting ? "Creating..." : "Create Manager"}
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

export default CreateManagerForm;
