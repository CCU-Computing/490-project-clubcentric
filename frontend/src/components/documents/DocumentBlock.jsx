import { useEffect, useState } from "react";
import { get_managers, get_document } from "../../services/documentService";
import DocumentManagerList from "./DocumentManagerList";

export default function DocumentBlock({ club_id }) {
  const [managersDocs, setManagersDocs] = useState([]);

  useEffect(() => {
    async function fetchDocuments() {
      if (!club_id) return;

      try {
        const managers = await get_managers(club_id);
        if (!managers) return;

        const docsByManager = await Promise.all(
          managers.map(async (manager) => {
            const docs = await get_document(null, manager.id);
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
