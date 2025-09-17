import { useState } from "react";
import { uploadDocument } from "../services/documentService";

function DocumentUploadForm()
{
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try {
            setStatus("Uploading...");
            await uploadDocument(file, title);
            setStatus("Upload successful!");
        } catch (err) {
            console.error(err);
            setStatus("Upload failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button type="submit">Upload</button>
            <p>{status}</p>
        </form>
    );
}

export default DocumentUploadForm;
