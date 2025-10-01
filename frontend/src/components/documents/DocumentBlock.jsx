import DocumentManagerList from "./DocumentManagerList";
import { useEffect, useState } from "react";
import { getManagers, getDocument } from "../../services/documentService";
export default function DocumentBlock({ club_id }) {
  const [managersDocs, setManagersDocs] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      if (!club_id) return;

      try {
        // 1. Get managers
        const managers = await getManagers(club_id);
        if (!managers) return;

        // 2. Fetch documents for each manager in parallel
        const docsByManager = await Promise.all(
          managers.map(async (manager) => {
            const docs = await getDocument(null, manager.id); // pass manager_id
            return { manager, docs };
          })
        );

        setManagersDocs(docsByManager); // state has managers + their documents
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    }

    fetchDocuments();
  }, [club_id]);
  
    return (
  <div>
    {managersDocs.map(({ manager, docs }) => (
      <div key={manager.id} className="mb-6 border p-4 rounded shadow">
        <h4 className="font-semibold mb-2">{manager.name}</h4>
        {docs.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          <ul>
            {docs.map((doc) => (
              <li key={doc.id}>
                <a 
                  href={doc.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {doc.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
);
}
