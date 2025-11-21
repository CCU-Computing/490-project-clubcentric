import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_membership } from "../../../services/clubService";
import { get_managers, delete_manager } from "../../../services/documentService";
import { CreateManagerForm } from "../../!form/document/CreateManagerForm";
import { UpdateManagerForm } from "../../!form/document/UpdateManagerForm";
import "../css/Cards.css";

export const ClubDocumentCard = ({
  clubId,
  currentUserId,
  onSelectManager
}) => {
  const [managers, setManagers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [deletingManagerId, setDeletingManagerId] = useState(null);

  useEffect(() => {
    fetchDocumentData();
  }, [clubId, currentUserId]);

  const fetchDocumentData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get document managers for this club
      const managerData = await get_managers(clubId);
      if (!managerData) {
        // Set empty array instead of error for missing data
        setManagers([]);
      } else {
        setManagers(Array.isArray(managerData) ? managerData : [managerData]);
      }

      // Get current user's role
      if (currentUserId) {
        const membership = await get_membership(clubId, currentUserId);
        setUserRole(membership?.role || 'member');
      }
    } catch (err) {
      // Handle 404 gracefully - just means no document managers yet
      if (err.response?.status === 404 || err.response?.status === 403) {
        setManagers([]);
        setError('');
      } else {
        setError('Unable to load document managers. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (managerId) => {
    setError('');

    try {
      const result = await delete_manager(managerId);
      if (!result) {
        throw new Error('Failed to delete document manager');
      }

      // Remove from local state
      setManagers(prev => prev.filter(mgr => mgr.id !== managerId));
      setDeletingManagerId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete document manager');
    }
  };

  const canEdit = userRole === 'organizer';

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading document managers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Document Managers</h2>
          {canEdit && (
            <div className="card-actions">
              <ActionButton
                label="Add Manager"
                onClick={() => setShowCreateForm(true)}
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

          {managers.length === 0 ? (
            <div className="empty-state">
              <p>No document managers yet</p>
              {canEdit && <p>Click "Add Manager" to create one</p>}
            </div>
          ) : (
            <ul className="card-list">
              {managers.map((manager) => (
                <li key={manager.id} className="card-list-item">
                  <div className="list-item-content">
                    <h3 className="list-item-title">{manager.name}</h3>
                    <p className="list-item-subtitle">
                      Manager ID: {manager.id}
                    </p>
                  </div>

                  <div className="list-item-actions">
                    <ActionButton
                      label="View Documents"
                      onClick={() => onSelectManager && onSelectManager(manager)}
                      variant="primary"
                    />
                    {canEdit && (
                      <>
                        <ActionButton
                          label="Edit"
                          onClick={() => setEditingManager(manager)}
                          variant="secondary"
                        />
                        {deletingManagerId === manager.id ? (
                          <>
                            <ActionButton
                              label="Confirm"
                              onClick={() => handleDelete(manager.id)}
                              variant="danger"
                            />
                            <ActionButton
                              label="Cancel"
                              onClick={() => setDeletingManagerId(null)}
                              variant="secondary"
                            />
                          </>
                        ) : (
                          <ActionButton
                            label="Delete"
                            onClick={() => setDeletingManagerId(manager.id)}
                            variant="danger"
                          />
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showCreateForm && (
        <CreateManagerForm
          clubId={clubId}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            fetchDocumentData();
          }}
        />
      )}

      {editingManager && (
        <UpdateManagerForm
          managerId={editingManager.id}
          initialName={editingManager.name}
          onClose={() => setEditingManager(null)}
          onSuccess={() => {
            setEditingManager(null);
            fetchDocumentData();
          }}
          onDelete={() => {
            setEditingManager(null);
            fetchDocumentData();
          }}
        />
      )}
    </>
  );
};

export default ClubDocumentCard;
