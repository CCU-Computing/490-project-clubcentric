import { useState, useEffect } from "react";
import { getDocument } from "../../services/documentService";
import DocumentItem from "./DocumentItem";
import DocumentUpload from "./DocumentUpload";

export default function DocumentList({ manager_id }) {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = () => {
    getDocument(null, manager_id).then(data => {
      if (data) setDocuments(data);
    });
  };

  useEffect(() => {
    if (!manager_id) return;
    fetchDocuments();
  }, [manager_id]);

  return (
    <div>
      <h3>Documents</h3>
      <DocumentUpload manager_id={manager_id} onUpload={fetchDocuments} />
      <ul>
        {documents.map(doc => (
          <DocumentItem key={doc.id} doc={doc} />
        ))}
      </ul>
    </div>
  );
}
