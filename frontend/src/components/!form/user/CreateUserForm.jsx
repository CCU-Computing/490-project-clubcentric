import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { ActionButton } from "../../!base/ActionButton";
import { create_user } from "../../../services/userService";
import "../css/UpdateUser.css";

export const CreateUserForm = ({
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    email: ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.first_name.trim()) {
      setError('First name is required');
      return;
    }

    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await create_user(
        formData.username,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.email
      );

      if (!result) {
        throw new Error('Failed to create user');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to create user');
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
          <h2>Create New User</h2>
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
            placeholder="Enter username"
            required
          />

          <TextField
            label="Password"
            value={formData.password}
            onChange={(val) => updateField('password', val)}
            placeholder="Enter password"
            type="password"
            required
          />

          <TextField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(val) => updateField('confirmPassword', val)}
            placeholder="Confirm password"
            type="password"
            required
          />

          <TextField
            label="First Name"
            value={formData.first_name}
            onChange={(val) => updateField('first_name', val)}
            placeholder="Enter first name"
            required
          />

          <TextField
            label="Last Name"
            value={formData.last_name}
            onChange={(val) => updateField('last_name', val)}
            placeholder="Enter last name"
            required
          />

          <TextField
            label="Email"
            value={formData.email}
            onChange={(val) => updateField('email', val)}
            placeholder="Enter email address"
            type="email"
            required
          />

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Creating..." : "Create User"}
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

export default CreateUserForm;
