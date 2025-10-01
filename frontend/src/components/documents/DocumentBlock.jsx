import { useEffect, useState } from "react";
import { getManagers, getDocument } from "../../services/documentService";
import DocumentManagerList from "./DocumentManagerList";

export default function DocumentBlock({ club_id }) {
  const [managersDocs, setManagersDocs] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      if (!club_id) return;

      try {
        const managers = await getManagers(club_id);
        if (!managers) return;

        const docsByManager = await Promise.all(
          managers.map(async (manager) => {
            const docs = await getDocument(null, manager.id);
            return { manager, docs };
          })
        );

        setManagersDocs(docsByManager);
      } catch (err) {
        console.error("Failed to load documents", err);
      }
    }

    fetchDocuments();
  }, [club_id]);

  return (
    <div>
      {managersDocs.map(({ manager, docs }) => (
        <DocumentManagerList key={manager.id} manager={{ ...manager, docs }} />
      ))}
    </div>
  );
}
