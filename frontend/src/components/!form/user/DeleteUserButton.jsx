import { useState } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { delete_user } from "../../../services/userService";
import "../css/UpdateUser.css";

export const DeleteUserButton = ({
  onDelete,
  onError
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);

    try {
      const result = await delete_user();

      if (!result) {
        throw new Error('Failed to delete user');
      }

      // Success - call onDelete callback
      if (onDelete) onDelete(result);
      setShowConfirm(false);

    } catch (err) {
      const errorMsg = err.message || 'Failed to delete user';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <ActionButton
        label="Delete Account"
        onClick={() => setShowConfirm(true)}
        variant="danger"
      />
    );
  }

  return (
    <div className="delete-confirm">
      <p className="delete-warning">
        Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
      </p>
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <div className="button-group">
        <ActionButton
          label={isDeleting ? "Deleting..." : "Confirm Delete"}
          onClick={handleDelete}
          disabled={isDeleting}
          variant="danger"
        />
        <ActionButton
          label="Cancel"
          onClick={() => setShowConfirm(false)}
          disabled={isDeleting}
          variant="secondary"
        />
      </div>
    </div>
  );
};

export default DeleteUserButton;
