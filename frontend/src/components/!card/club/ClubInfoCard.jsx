import { useState } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { delete_club, join_club } from "../../../services/clubService";
import { UpdateClubForm } from "../../!form/club/ClubUpdateForm";
import "../css/Cards.css";

export const ClubInfoCard = ({
  club,
  userRole,
  currentUserId,
  onDelete,
  onClubUpdate,
  onMembershipChange
}) => {
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleDelete = async () => {
    setError('');

    try {
      const result = await delete_club(club.id);
      if (!result) {
        throw new Error('Failed to delete club');
      }

      if (onDelete) onDelete(result);
    } catch (err) {
      setError(err.message || 'Failed to delete club');
    }
  };

  const handleJoinClub = async () => {
    setError('');
    setIsJoining(true);

    try {
      const result = await join_club(club.id);
      if (!result) {
        throw new Error('Failed to join club');
      }

      // Refresh membership data
      if (onMembershipChange) onMembershipChange();
    } catch (err) {
      setError(err.message || 'Failed to join club');
    } finally {
      setIsJoining(false);
    }
  };

  const canEdit = userRole === 'organizer';
  const isNotMember = currentUserId && !userRole;

  if (!club) {
    return (
      <div className="card">
        <div className="card-error">
          <p>Club data not available</p>
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
          {(canEdit || isNotMember) && (
            <div className="card-actions">
              {canEdit && (
                <ActionButton
                  label="Edit Club"
                  onClick={() => setShowUpdateForm(true)}
                  variant="primary"
                />
              )}
              {isNotMember && (
                <ActionButton
                  label={isJoining ? "Joining..." : "Join Club"}
                  onClick={handleJoinClub}
                  disabled={isJoining}
                  variant="primary"
                />
              )}
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
          clubId={club.id}
          initialData={club}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={() => {
            setShowUpdateForm(false);
            if (onClubUpdate) onClubUpdate();
          }}
        />
      )}
    </>
  );
};

export default ClubInfoCard;
