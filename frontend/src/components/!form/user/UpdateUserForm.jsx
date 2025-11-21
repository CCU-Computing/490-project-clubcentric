import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { update_user } from "../../../services/userService";
import "../css/UpdateUser.css"

export const UpdateUserForm = ({ 
  initialData = {},
  onClose,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    username: initialData.username || '',
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    email: initialData.email || '',
    bio: initialData.bio || '',
    profile_picture: null
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Use the update_user service function
      const result = await update_user(
        formData.username || null,
        formData.first_name || null,
        formData.last_name || null,
        formData.email || null,
        formData.bio || null,
        formData.profile_picture || null
      );

      if (!result) {
        throw new Error('Failed to update user');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to update user');
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
          <h2>Update Profile</h2>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <TextField
            label="Username"
            value={formData.username}
            onChange={(val) => updateField('username', val)}
            placeholder="Leave blank to keep current"
          />

          <TextField
            label="First Name"
            value={formData.first_name}
            onChange={(val) => updateField('first_name', val)}
            placeholder="Leave blank to keep current"
          />

          <TextField
            label="Last Name"
            value={formData.last_name}
            onChange={(val) => updateField('last_name', val)}
            placeholder="Leave blank to keep current"
          />

          <TextField
            label="Email"
            value={formData.email}
            onChange={(val) => updateField('email', val)}
            placeholder="Leave blank to keep current"
            type="email"
          />

          <div className="form-field">
            <label className="form-label">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Leave blank to keep current"
              rows={4}
              className="form-textarea"
            />
          </div>

          <FileField
            label="Profile Picture"
            onChange={(file) => updateField('profile_picture', file)}
            accept="image/*"
          />

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Updating..." : "Update Profile"}
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

export default function UpdateUserFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const mockInitialData = {
    username: "john_doe",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    bio: "Computer science student interested in web development"
  };

  const handleSuccess = (data) => {
    console.log("User updated successfully:", data);
    alert("Profile updated successfully!");
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f0f4f8' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#093331' }}>
          Update User Form Demo
        </h1>
        <p style={{ marginBottom: '1.5rem', color: '#4a5568' }}>
          This is background content. Click the button to see the form overlay.
        </p>

        <ActionButton
          label="Update Profile"
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
        <UpdateUserForm
          initialData={mockInitialData}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}