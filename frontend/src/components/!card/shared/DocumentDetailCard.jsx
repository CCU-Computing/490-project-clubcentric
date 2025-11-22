import { useState, useEffect } from "react";
import { ActionButton } from "../../!base/ActionButton";
import { get_document, delete_document } from "../../../services/documentService";
import { UploadDocumentForm } from "../../!form/document/UploadDocumentForm";
import "../css/Cards.css";

export const DocumentDetailCard = ({
  manager,
  canEdit = false,
  onBack
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState(null);

  useEffect(() => {
    if (manager?.id) {
      fetchDocuments();
    }
  }, [manager]);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');

    try {
      const documentData = await get_document(null, manager.id);
      if (!documentData) {
        // Set empty array instead of error for missing data
        setDocuments([]);
      } else {
        setDocuments(Array.isArray(documentData) ? documentData : [documentData]);
      }
    } catch (err) {
      // Handle 404 gracefully - just means no documents yet
      if (err.response?.status === 404) {
        setDocuments([]);
        setError('');
      } else {
        setError('Unable to load documents. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    setError('');

    try {
      const result = await delete_document(documentId);
      if (!result) {
        throw new Error('Failed to delete document');
      }

      // Remove from local state
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      setDeletingDocumentId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete document');
    }
  };

  const handleDownload = (document) => {
    if (document.file) {
      // Open the file URL in a new window/tab
      window.open(document.file, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-loading">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">{manager.name}</h2>
            <p className="card-subtitle">Documents</p>
          </div>
          <div className="card-actions">
            {onBack && (
              <ActionButton
                label="← Back"
                onClick={onBack}
                variant="secondary"
              />
            )}
            {canEdit && (
              <ActionButton
                label="Upload Document"
                onClick={() => setShowUploadForm(true)}
                variant="primary"
              />
            )}
          </div>
        </div>

        <div className="card-body">
          {error && (
            <div className="card-error">
              <p>{error}</p>
            </div>
          )}

          {documents.length === 0 ? (
            <div className="empty-state">
              <p>No documents uploaded</p>
              {canEdit && <p>Click "Upload Document" to add one</p>}
            </div>
          ) : (
            <ul className="card-list">
              {documents.map((document) => (
                <li key={document.id} className="card-list-item">
                  <div className="list-item-content">
                    <h3 className="list-item-title">{document.title}</h3>
                    <p className="list-item-subtitle">
                      Uploaded: {document.uploaded_at ? new Date(document.uploaded_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>

                  <div className="list-item-actions">
                    <ActionButton
                      label="Download"
                      onClick={() => handleDownload(document)}
                      variant="primary"
                    />
                    {canEdit && (
                      <>
                        {deletingDocumentId === document.id ? (
                          <>
                            <ActionButton
                              label="Confirm"
                              onClick={() => handleDelete(document.id)}
                              variant="danger"
                            />
                            <ActionButton
                              label="Cancel"
                              onClick={() => setDeletingDocumentId(null)}
                              variant="secondary"
                            />
                          </>
                        ) : (
                          <ActionButton
                            label="Delete"
                            onClick={() => setDeletingDocumentId(document.id)}
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

      {showUploadForm && (
        <UploadDocumentForm
          managerId={manager.id}
          onClose={() => setShowUploadForm(false)}
          onSuccess={() => {
            setShowUploadForm(false);
            fetchDocuments();
          }}
        />
      )}
    </>
  );
};

export default DocumentDetailCard;
