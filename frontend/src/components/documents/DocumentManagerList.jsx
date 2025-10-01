import { useState, useEffect } from "react";
import { getManagers } from "../../services/documentService";
import DocumentList from "./DocumentList";

export default function DocumentManagerList({ club_id }) {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

  useEffect(() => {
    if (!club_id) return;
    getManagers(club_id).then(data => {
      if (data) setManagers(data);
    });
  }, [club_id]);

  return (
    <div>
      <h2>Document Managers</h2>
      <ul>
        {managers.map(manager => (
          <li key={manager.id}>
            <button onClick={() => setSelectedManager(manager)}>
              {manager.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedManager && (
        <DocumentList manager_id={selectedManager.id} />
      )}
    </div>
  );
}
