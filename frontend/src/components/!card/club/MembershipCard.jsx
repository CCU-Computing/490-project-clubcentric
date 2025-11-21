import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_membership, update_membership, remove_membership } from "../../../services/clubService";
import { get_user } from "../../../services/userService";
import "../css/Cards.css";

export const MembershipCard = ({
  clubId,
  currentUserId,
  userRole
}) => {
  const [memberDetails, setMemberDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMembershipData();
  }, [clubId]);

  const fetchMembershipData = async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all members for this club
      const membersData = await get_membership(clubId, null);

      // Backend returns array of {user_id, role}
      const members = Array.isArray(membersData) ? membersData : [];

      // Fetch full details for each member
      const detailsPromises = members.map(async (member) => {
        try {
          const userInfo = await get_user(member.user_id);
          return {
            ...member,
            userInfo: userInfo || {}
          };
        } catch {
          return {
            ...member,
            userInfo: {}
          };
        }
      });

      const details = await Promise.all(detailsPromises);
      setMemberDetails(details);
    } catch (err) {
      // Handle 404 gracefully - means no members yet
      if (err.response?.status === 404) {
        setMemberDetails([]);
        setError('');
      } else {
        setError('Unable to load members. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId) => {
    setActionLoading(`promote-${userId}`);
    setError('');

    try {
      const result = await update_membership(userId, clubId, 'organizer');
      if (!result) {
        throw new Error('Failed to promote member');
      }

      // Update local state
      setMemberDetails(prev =>
        prev.map(m =>
          m.user_id === userId ? { ...m, role: 'organizer' } : m
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to promote member');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId) => {
    setActionLoading(`demote-${userId}`);
    setError('');

    try {
      const result = await update_membership(userId, clubId, 'member');
      if (!result) {
        throw new Error('Failed to demote organizer');
      }

      // Update local state
      setMemberDetails(prev =>
        prev.map(m =>
          m.user_id === userId ? { ...m, role: 'member' } : m
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to demote organizer');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (userId) => {
    setActionLoading(`remove-${userId}`);
    setError('');

    try {
      const result = await remove_membership(clubId, userId);
      if (!result) {
        throw new Error('Failed to remove member');
      }

      // Update local state
      setMemberDetails(prev => prev.filter(m => m.user_id !== userId));
    } catch (err) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setActionLoading(null);
    }
  };

  const canManageMembers = userRole === 'organizer';

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Members ({memberDetails.length})</h2>
      </div>

      <div className="card-body">
        {error && (
          <div className="card-error">
            <p>{error}</p>
          </div>
        )}

        {memberDetails.length === 0 ? (
          <div className="empty-state">
            <p>No members found</p>
          </div>
        ) : (
          <div>
            {memberDetails.map((member) => {
              const { userInfo, user_id, role } = member;
              const isCurrentUser = user_id === currentUserId;
              const initials = userInfo.first_name && userInfo.last_name
                ? `${userInfo.first_name[0]}${userInfo.last_name[0]}`
                : '?';

              return (
                <div key={user_id} className="member-item">
                  <div className="member-info">
                    <div className="member-avatar">
                      {userInfo.profile_picture ? (
                        <img
                          src={userInfo.profile_picture}
                          alt={`${userInfo.first_name} ${userInfo.last_name}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        initials.toUpperCase()
                      )}
                    </div>
                    <div className="member-details">
                      <p className="member-name">
                        {userInfo.first_name} {userInfo.last_name}
                        {isCurrentUser && ' (You)'}
                      </p>
                      <p className="member-email">
                        {userInfo.email || userInfo.username}
                      </p>
                    </div>
                    <span className={`badge badge-${role}`}>
                      {role}
                    </span>
                  </div>

                  {canManageMembers && !isCurrentUser && (
                    <div className="member-actions">
                      {role === 'member' ? (
                        <ActionButton
                          label={actionLoading === `promote-${user_id}` ? "Promoting..." : "Promote to Organizer"}
                          onClick={() => handlePromote(user_id)}
                          disabled={!!actionLoading}
                          variant="primary"
                        />
                      ) : (
                        <ActionButton
                          label={actionLoading === `demote-${user_id}` ? "Demoting..." : "Demote to Member"}
                          onClick={() => handleDemote(user_id)}
                          disabled={!!actionLoading}
                          variant="secondary"
                        />
                      )}
                      <ActionButton
                        label={actionLoading === `remove-${user_id}` ? "Removing..." : "Remove"}
                        onClick={() => handleRemove(user_id)}
                        disabled={!!actionLoading}
                        variant="danger"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
