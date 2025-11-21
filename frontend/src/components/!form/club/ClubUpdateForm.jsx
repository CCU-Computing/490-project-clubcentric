import { useState } from "react";
import { TextField } from "../../!base/TextField";
import { DateField } from "../../!base/DateField";
import { FileField } from "../../!base/FileField";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { update_club } from "../../../services/clubService";
import "../css/ClubUpdate.css";

// Main Update Club Form Component
export const UpdateClubForm = ({ 
  clubId,
  initialData = {},
  onClose,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    picture: null,
    links: initialData.links || '',
    summary: initialData.summary || '',
    videoEmbed: initialData.videoEmbed || '',
    tags: initialData.tags || '',
    lastMeetingDate: initialData.lastMeetingDate || ''
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Parse tags and links if they're strings
      const tagsArray = typeof formData.tags === 'string'
        ? formData.tags.split(' ').filter(t => t.trim() !== '')
        : (Array.isArray(formData.tags) ? formData.tags : []);

      const linksArray = typeof formData.links === 'string'
        ? formData.links.split(' ').filter(l => l.trim() !== '')
        : (Array.isArray(formData.links) ? formData.links : []);

      // Use the update_club service function
      const result = await update_club(
        clubId,
        formData.name || null,
        formData.description || null,
        formData.picture || null,
        linksArray,
        formData.summary || null,
        formData.videoEmbed || null,
        tagsArray,
        formData.lastMeetingDate || null
      );

      if (!result) {
        throw new Error('Failed to update club');
      }

      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      setError(err.message || 'Failed to update club');
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
          <h2>Update Club</h2>
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
            placeholder="Leave blank to keep current"
          />

          <div className="form-field">
            <label className="form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Leave blank to keep current"
              rows={4}
              className="form-textarea"
            />
          </div>

          <FileField
            label="Club Picture"
            onChange={(file) => updateField('picture', file)}
            accept="image/*"
          />

          <TextField
            label="Links"
            value={formData.links}
            onChange={(val) => updateField('links', val)}
            placeholder="e.g., website URL"
          />

          <TextField
            label="Summary"
            value={formData.summary}
            onChange={(val) => updateField('summary', val)}
            placeholder="Brief summary"
          />

          <TextField
            label="Video Embed Code"
            value={formData.videoEmbed}
            onChange={(val) => updateField('videoEmbed', val)}
            placeholder="e.g., YouTube embed code"
          />

          <TextField
            label="Tags"
            value={formData.tags}
            onChange={(val) => updateField('tags', val)}
            placeholder="e.g., sports, academic, social"
          />

          <DateField
            label="Last Meeting Date"
            value={formData.lastMeetingDate}
            onChange={(val) => updateField('lastMeetingDate', val)}
          />

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Updating..." : "Update Club"}
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
// Demo Component
export default function UpdateClubFormDemo() {
  const [showForm, setShowForm] = useState(false);

  const mockInitialData = {
    name: "Chess Club",
    description: "Weekly chess meetings and tournaments",
    links: "https://chessclub.example.com",
    summary: "For chess enthusiasts of all levels",
    tags: "games, strategy, competition",
    lastMeetingDate: "2024-11-15"
  };

  const handleSuccess = (data) => {
    console.log("Club updated successfully:", data);
    alert("Club updated successfully!");
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#093331' }}>
          Update Club Form Demo
        </h1>
        <p className="mb-6 text-gray-700">
          This is background content. Click the button to see the form overlay.
        </p>

        <ActionButton
          label="Open Update Form"
          onClick={() => setShowForm(true)}
          variant="primary"
        />

        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#093331' }}>
            Existing Page Content
          </h2>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. The form will 
            overlay on top of this content when opened.
          </p>
        </div>
      </div>

      {showForm && (
        <UpdateClubForm
          clubId="123"
          initialData={mockInitialData}
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}