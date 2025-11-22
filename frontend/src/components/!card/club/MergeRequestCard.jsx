import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButton } from "../../!base/ActionButton";
import { get_merge, update_merge, delete_merge } from "../../../services/clubService";
import "../css/Cards.css";

export const MergeRequestCard = ({
  clubId,
  clubName,
  userRole,
  onMergeRequestChange
}) => {
  const navigate = useNavigate();
  const [mergeRequests, setMergeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchMergeRequests();
  }, [clubId]);

  const fetchMergeRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await get_merge(clubId);
      // Backend now returns an array
      setMergeRequests(Array.isArray(result) ? result : []);
    } catch (err) {
      // Empty array means no merge requests exist - that's okay
      setMergeRequests([]);
      if (err.response?.status !== 404) {
        setError('Failed to load merge requests');
        console.error('Error fetching merge requests:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMerge = async (mergeRequestId) => {
    setError('');
    setProcessingId(mergeRequestId);

    try {
      const result = await update_merge(clubId);

      if (!result) {
        throw new Error('Failed to accept merge request');
      }

      // Refresh the merge request data
      await fetchMergeRequests();

      // Notify parent component
      if (onMergeRequestChange) onMergeRequestChange();

      // If merge is complete, show success message
      if (result.merged_id) {
        alert(`Merge completed successfully! Merged club ID: ${result.merged_id}`);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to accept merge request';
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteMerge = async (mergeRequestId) => {
    setError('');
    setProcessingId(mergeRequestId);

    try {
      const result = await delete_merge(clubId);

      if (!result) {
        throw new Error('Failed to delete merge request');
      }

      // Refresh merge request data
      await fetchMergeRequests();
      setDeleteConfirmId(null);

      // Notify parent component
      if (onMergeRequestChange) onMergeRequestChange();

    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to delete merge request';
      setError(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewMergedClub = (mergedId) => {
    navigate(`/club/${mergedId}`);
  };

  const canManageMerge = userRole === 'organizer';

  // Don't render card if no merge requests exist
  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading merge requests...</p>
        </div>
      </div>
    );
  }

  if (mergeRequests.length === 0) {
    return null; // No merge requests exist - don't show anything
  }

  // Render function for a single merge request
  const renderMergeRequest = (mergeRequest, index) => {
    const isWaitingForUs = mergeRequest["waiting for your club to accept"];
    const isWaitingForOther = mergeRequest["waiting for other club to accept"];
    const isReadyToMerge = mergeRequest["ready to merge"];
    const mergedClubId = mergeRequest.merged_id;
    const otherClubName = mergeRequest.other_club_name || 'Unknown Club';
    const otherClubId = mergeRequest.other_club_id;
    const weAccepted = mergeRequest.we_accepted;
    const theyAccepted = mergeRequest.they_accepted;
    const mergeRequestId = mergeRequest.merge_request_id;
    const isProcessing = processingId === mergeRequestId;
    const showDeleteConfirm = deleteConfirmId === mergeRequestId;

    // Determine status badge and message
    let statusBadge = null;
    let statusMessage = '';
    let showAcceptButton = false;
    let bgColor = '#ffffff';

    if (mergedClubId) {
      statusBadge = (
        <span className="badge" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
          Merge Complete
        </span>
      );
      statusMessage = `Successfully merged with ${otherClubName}!`;
      bgColor = '#f0fdf4';
    } else if (isReadyToMerge) {
      statusBadge = (
        <span className="badge" style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}>
          Ready to Merge
        </span>
      );
      statusMessage = `Both clubs have accepted. Merge with ${otherClubName} will be completed when processed.`;
      bgColor = '#eff6ff';
    } else if (isWaitingForUs) {
      statusBadge = (
        <span className="badge" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>
          Action Required
        </span>
      );
      statusMessage = `${otherClubName} wants to merge with your club. Please review and accept.`;
      showAcceptButton = canManageMerge;
      bgColor = '#fffbeb';
    } else if (isWaitingForOther) {
      statusBadge = (
        <span className="badge" style={{ backgroundColor: '#6b7280', color: '#ffffff' }}>
        Pending
      </span>
      );
      statusMessage = `Waiting for ${otherClubName} to accept your merge request.`;
      bgColor = '#f9fafb';
    }

    return (
      <div
        key={mergeRequestId || index}
        style={{
          backgroundColor: bgColor,
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: index < mergeRequests.length - 1 ? '1rem' : '0'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {statusBadge}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Your Club: </span>
            <span style={{ color: '#111827' }}>{clubName}</span>
            {weAccepted && <span style={{ marginLeft: '0.5rem', color: '#10b981', fontWeight: '500' }}>✓ Accepted</span>}
            {!weAccepted && <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: '500' }}>⏳ Pending</span>}
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Merging With: </span>
            <span style={{ color: '#111827' }}>{otherClubName}</span>
            {theyAccepted && <span style={{ marginLeft: '0.5rem', color: '#10b981', fontWeight: '500' }}>✓ Accepted</span>}
            {!theyAccepted && <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: '500' }}>⏳ Pending</span>}
          </div>

          <div>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{statusMessage}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {showAcceptButton && (
            <ActionButton
              label={isProcessing ? "Processing..." : "Accept Merge"}
              onClick={() => handleAcceptMerge(mergeRequestId)}
              disabled={isProcessing}
              variant="primary"
            />
          )}

          {!mergedClubId && otherClubId && (
            <ActionButton
              label={`View ${otherClubName}`}
              onClick={() => navigate(`/club/${otherClubId}`)}
              variant="secondary"
            />
          )}

          {mergedClubId && (
            <ActionButton
              label="View Merged Club"
              onClick={() => handleViewMergedClub(mergedClubId)}
              variant="primary"
            />
          )}

          {canManageMerge && !mergedClubId && !showDeleteConfirm && (
            <ActionButton
              label="Cancel Request"
              onClick={() => setDeleteConfirmId(mergeRequestId)}
              disabled={isProcessing}
              variant="danger"
            />
          )}
        </div>

        {showDeleteConfirm && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>
            <p style={{ color: '#991b1b', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
              Are you sure you want to cancel this merge request?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <ActionButton
                label="Confirm Cancel"
                onClick={() => handleDeleteMerge(mergeRequestId)}
                disabled={isProcessing}
                variant="danger"
              />
              <ActionButton
                label="Keep Request"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isProcessing}
                variant="secondary"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Club Merge Request{mergeRequests.length > 1 ? 's' : ''}
          <span style={{
            marginLeft: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 'normal',
            color: '#6b7280'
          }}>
            ({mergeRequests.length})
          </span>
        </h2>
      </div>

      <div className="card-body">
        {error && (
          <div className="card-error">
            <p>{error}</p>
          </div>
        )}

        {mergeRequests.map((request, index) => renderMergeRequest(request, index))}

        {!canManageMerge && (
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginTop: '1rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#374151',
              margin: 0
            }}>
              Only club organizers can manage merge requests.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergeRequestCard;
