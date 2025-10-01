import { useState } from "react";
import { uploadDocument } from "../../services/documentService";

export default function DocumentUpload({ manager_id, onUpload }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file || !manager_id) return;

    const result = await uploadDocument(title, file, manager_id);
    if (result) {
      setTitle("");
      setFile(null);
      onUpload(); // refresh document list
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}
