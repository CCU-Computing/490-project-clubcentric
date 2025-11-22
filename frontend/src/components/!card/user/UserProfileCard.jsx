import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_user } from "../../../services/userService";
import { UpdateUserForm } from "../../!form/user/UpdateUserForm";
import { DeleteUserButton } from "../../!form/user/DeleteUserButton";
import "../css/Cards.css";

export const UserProfileCard = ({
  userId,
  currentUserId,
  onDelete
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      // If userId is provided, fetch that user; otherwise fetch current user
      const userData = await get_user(userId || null);
      if (!userData) {
        throw new Error('Failed to load user information');
      }
      setUser(userData);
    } catch (err) {
      setError(err.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // User can only edit their own profile
  const isOwner = !userId || userId === currentUserId;

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
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
            <h2 className="card-title">
              {user.first_name} {user.last_name}
            </h2>
            <p className="card-subtitle">@{user.username}</p>
            {isOwner && (
              <span className="badge badge-owner">Your Profile</span>
            )}
          </div>
          {isOwner && (
            <div className="card-actions">
              <ActionButton
                label="Edit Profile"
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
              <span className="info-label">Username:</span>
              <span className="info-value">{user.username}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{user.email}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Name:</span>
              <span className="info-value">
                {user.first_name} {user.last_name}
              </span>
            </div>

            {user.bio && (
              <div className="info-row">
                <span className="info-label">Bio:</span>
                <span className="info-value">{user.bio}</span>
              </div>
            )}

            {user.profile_picture && (
              <div className="info-row">
                <span className="info-label">Profile Picture:</span>
                <div className="info-value">
                  <img
                    src={user.profile_picture}
                    alt={`${user.username}'s profile`}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #093331'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="action-panel">
              <DeleteUserButton
                onDelete={onDelete}
                onError={(err) => setError(err)}
              />
            </div>
          )}
        </div>
      </div>

      {showUpdateForm && (
        <UpdateUserForm
          initialData={user}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={() => {
            setShowUpdateForm(false);
            fetchUserData();
          }}
        />
      )}
    </>
  );
};

export default UserProfileCard;
