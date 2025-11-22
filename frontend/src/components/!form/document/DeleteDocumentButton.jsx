import { useState } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { delete_document } from "../../../services/documentService";
import "../css/DocumentForms.css";

export const DeleteDocumentButton = ({
  documentId,
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
      const result = await delete_document(documentId);

      if (!result) {
        throw new Error('Failed to delete document');
      }

      // Success - call onDelete callback
      if (onDelete) onDelete(result);
      setShowConfirm(false);

    } catch (err) {
      const errorMsg = err.message || 'Failed to delete document';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showConfirm) {
    return (
      <ActionButton
        label="Delete Document"
        onClick={() => setShowConfirm(true)}
        variant="danger"
      />
    );
  }

  return (
    <div className="delete-confirm">
      <p className="delete-warning">
        Are you sure you want to delete this document? This action cannot be undone.
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

export default DeleteDocumentButton;
