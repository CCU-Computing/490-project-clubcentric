import { useState } from "react";
import DocumentButton from "./DocumentButton";
import DocumentViewer from "./DocumentViewer";

export default function DocumentManagerList({ manager }) {
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="mb-6 border p-4 rounded shadow">
      <h3 className="font-semibold mb-2">{manager.name}</h3>

      <div>
        {manager.docs.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          manager.docs.map((doc) => (
            <DocumentButton key={doc.id} doc={doc} onOpen={setSelectedDoc} />
          ))
        )}
      </div>

      {/* Show the selected document */}
      <DocumentViewer doc={selectedDoc} />
    </div>
  );
}
