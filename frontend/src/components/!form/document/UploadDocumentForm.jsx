import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { FileField } from "../../!base/FileField";
import { ActionButton } from "../../!base/ActionButton";
import { upload_document } from "../../../services/documentService";
import "../css/DocumentForms.css";

export const UploadDocumentForm = ({
  onClose,
  onSuccess,
  managerId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    manager_id: managerId || '',
    file: null
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!formData.title.trim()) {
      setError('Document title is required');
      return;
    }

    if (!formData.manager_id) {
      setError('Manager ID is required');
      return;
    }

    if (!formData.file) {
      setError('File is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await upload_document(
        formData.title,
        formData.manager_id,
        formData.file
      );

      if (!result) {
        throw new Error('Failed to upload document');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateField('file', file);
    }
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
          <h2>Upload Document</h2>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <TextField
            label="Document Title"
            value={formData.title}
            onChange={(val) => updateField('title', val)}
            placeholder="Enter document title"
            required
          />

          <TextField
            label="Manager ID"
            value={formData.manager_id}
            onChange={(val) => updateField('manager_id', val)}
            placeholder="Enter manager ID"
            required
            disabled={!!managerId}
          />

          <div className="form-field">
            <label className="form-label">
              File <span className="required">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="form-input"
              required
            />
            {formData.file && (
              <p className="file-name">Selected: {formData.file.name}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Uploading..." : "Upload Document"}
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

export default UploadDocumentForm;
