import { useState, useEffect } from "react";
import { SelectField } from "../../!base/SelectField";
import { ActionButton } from "../../!base/ActionButton";
import { create_merge } from "../../../services/clubService";
import { getClubs } from "../../../services/clubService";
import "../css/ClubCreate.css";

export const MergeRequestCreateForm = ({
  clubId,
  clubName,
  onClose,
  onSuccess
}) => {
  const [targetClubId, setTargetClubId] = useState('');
  const [availableClubs, setAvailableClubs] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAvailableClubs();
  }, [clubId]);

  const fetchAvailableClubs = async () => {
    setIsLoading(true);
    try {
      const clubs = await getClubs();

      // Filter out the current club
      const filtered = clubs.filter(club => club.id !== parseInt(clubId));

      setAvailableClubs(filtered);
    } catch (err) {
      setError('Failed to load available clubs');
      console.error('Error fetching clubs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');

    // Validate required fields
    if (!targetClubId) {
      setError('Please select a club to merge with');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the create_merge service function
      const result = await create_merge(clubId, targetClubId);

      if (!result) {
        throw new Error('Failed to create merge request');
      }

      // Success - call onSuccess callback and close
      if (onSuccess) onSuccess(result);
      if (onClose) onClose();

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create merge request';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clubOptions = availableClubs.map(club => ({
    value: club.id,
    label: club.name
  }));

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
          <h2>Create Merge Request</h2>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem', marginBottom: 0 }}>
            Request to merge {clubName} with another club
          </p>
        </div>

        {/* Form Body */}
        <div className="modal-body">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <div className="spinner"></div>
              <p>Loading available clubs...</p>
            </div>
          ) : availableClubs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <p>No other clubs available to merge with.</p>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label className="form-label">
                  Current Club
                </label>
                <input
                  type="text"
                  value={clubName}
                  disabled
                  className="form-input"
                  style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>

              <SelectField
                label="Target Club"
                value={targetClubId}
                onChange={setTargetClubId}
                options={clubOptions}
                placeholder="Select a club to merge with"
                required
              />

              <div style={{
                backgroundColor: '#f0f9ff',
                border: '2px solid #93c5fd',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#1e40af',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  <strong>Note:</strong> Creating a merge request will notify the other club's organizers.
                  Both clubs must accept before the merge can be completed.
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="button-group">
            <ActionButton
              label={isSubmitting ? "Creating..." : "Create Request"}
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading || availableClubs.length === 0}
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

export default MergeRequestCreateForm;
