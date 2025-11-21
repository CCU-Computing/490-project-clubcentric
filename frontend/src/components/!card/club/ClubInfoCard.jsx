import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_club, get_membership, delete_club } from "../../../services/clubService";
import { CreateClubForm } from "../../!form/club/ClubCreateForm";
import { UpdateClubForm } from "../../!form/club/ClubUpdateForm";
import "../css/Cards.css";

export const ClubInfoCard = ({
  clubId,
  currentUserId,
  onDelete
}) => {
  const [club, setClub] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchClubData();
  }, [clubId, currentUserId]);

  const fetchClubData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch club info
      const clubData = await get_club(clubId);
      if (!clubData) {
        throw new Error('Failed to load club information');
      }
      setClub(clubData);

      // Fetch user's membership to determine role
      if (currentUserId) {
        const membership = await get_membership(clubId, currentUserId);
        setUserRole(membership?.role || 'member');
      }
    } catch (err) {
      setError(err.message || 'Failed to load club data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setError('');

    try {
      const result = await delete_club(clubId);
      if (!result) {
        throw new Error('Failed to delete club');
      }

      if (onDelete) onDelete(result);
    } catch (err) {
      setError(err.message || 'Failed to delete club');
    }
  };

  const canEdit = userRole === 'organizer';

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading club information...</p>
        </div>
      </div>
    );
  }

  if (error && !club) {
    return (
      <div className="card">
        <div className="card-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{club.name}</h2>
            {userRole && (
              <p className="card-subtitle">
                <span className={`badge badge-${userRole}`}>{userRole}</span>
              </p>
            )}
          </div>
          {canEdit && (
            <div className="card-actions">
              <ActionButton
                label="Edit Club"
                onClick={() => setShowUpdateForm(true)}
                variant="primary"
              />
            </div>
          )}
        </div>

        <div className="card-body">
          {error && (
            <div className="card-error">
              <p>{error}</p>
            </div>
          )}

          <div className="card-section">
            <div className="info-row">
              <span className="info-label">Description:</span>
              <span className="info-value">{club.description || 'No description available'}</span>
            </div>

            {club.summary && (
              <div className="info-row">
                <span className="info-label">Summary:</span>
                <span className="info-value">{club.summary}</span>
              </div>
            )}

            {club.tags && club.tags.length > 0 && (
              <div className="info-row">
                <span className="info-label">Tags:</span>
                <span className="info-value">{club.tags.join(', ')}</span>
              </div>
            )}

            {club.lastMeetingDate && (
              <div className="info-row">
                <span className="info-label">Last Meeting:</span>
                <span className="info-value">{new Date(club.lastMeetingDate).toLocaleDateString()}</span>
              </div>
            )}

            {club.videoEmbed && (
              <div className="info-row">
                <span className="info-label">Video:</span>
                <span className="info-value">
                  <a href={club.videoEmbed} target="_blank" rel="noopener noreferrer">
                    View Video
                  </a>
                </span>
              </div>
            )}

            {club.links && club.links.length > 0 && (
              <div className="info-row">
                <span className="info-label">Links:</span>
                <div className="info-value">
                  {club.links.map((link, index) => (
                    <div key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {canEdit && (
            <div className="action-panel">
              {!showDeleteConfirm ? (
                <ActionButton
                  label="Delete Club"
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="danger"
                />
              ) : (
                <div className="delete-confirm">
                  <p className="delete-warning">
                    Are you sure you want to delete this club? This action cannot be undone.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <ActionButton
                      label="Confirm Delete"
                      onClick={handleDelete}
                      variant="danger"
                    />
                    <ActionButton
                      label="Cancel"
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="secondary"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showUpdateForm && (
        <UpdateClubForm
          clubId={clubId}
          initialData={club}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={() => {
            setShowUpdateForm(false);
            fetchClubData();
          }}
        />
      )}
    </>
  );
};

export default ClubInfoCard;
