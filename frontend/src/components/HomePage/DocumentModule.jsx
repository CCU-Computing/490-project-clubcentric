import { useEffect, useState } from "react";
import { uploadDocument } from "../../services/documentService";

export default function DocumentModule({ clubId }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    async function fetchDocs() {
      const docs = await uploadDocument.getDocuments(clubId);
      setFiles(docs);
    }
    fetchDocs();
  }, [clubId]);

  const uploadFile = async () => {
    if (!selectedFile) return;
    await uploadDocument.uploadDocument(clubId, selectedFile);
    setFiles((prev) => [...prev, { title: selectedFile.name }]);
    setSelectedFile(null);
  };

  return (
    <div>
      <h3>Documents</h3>
      <ul>
        {files.map((f, i) => (
          <li key={i}>{f.title}</li>
        ))}
      </ul>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}
