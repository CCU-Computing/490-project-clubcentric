import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { create_club } from "../../../services/clubService";
import "../css/ClubCreate.css"

export const CreateClubForm = ({ 
  onClose,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Club name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the create_club service function
      const result = await create_club(
        formData.name.trim(),
        formData.description.trim()
      );

      if (!result) {
        throw new Error('Failed to create club');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to create club');
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
          <h2>Create New Club</h2>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <TextField
            label="Club Name"
            value={formData.name}
            onChange={(val) => updateField('name', val)}
            placeholder="Enter club name"
            required
          />

          <div className="form-field">
            <label className="form-label">
              Description <span className="required">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter club description"
              rows={6}
              required
              className="form-textarea"
            />
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Creating..." : "Create Club"}
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


export default function CreateClubFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = (data) => {
    console.log("Club created successfully:", data);
    alert("Club created successfully!");
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f0f4f8' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#093331' }}>
          Create Club Form Demo
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
          This is background content. Click the button to see the form overlay.
        </p>

        <ActionButton
          label="Create New Club"
          onClick={() => setShowForm(true)}
          variant="primary"
        />

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#093331' }}>
            Existing Page Content
          </h2>
          <p style={{ color: '#718096' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. The form will 
            overlay on top of this content when opened.
          </p>
        </div>
      </div>

      {showForm && (
        <CreateClubForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};