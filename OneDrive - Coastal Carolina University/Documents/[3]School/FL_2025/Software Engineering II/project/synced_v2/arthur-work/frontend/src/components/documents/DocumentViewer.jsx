export default function DocumentViewer({ doc }) {
  if (!doc) return null;

  return (
    <div className="mt-4 border p-4 rounded shadow">
      <h4 className="font-semibold mb-2">{doc.title}</h4>
      <a 
        href={doc.file} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Open Document
      </a>
    </div>
  );
}
