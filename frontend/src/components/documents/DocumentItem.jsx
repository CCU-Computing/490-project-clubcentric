export default function DocumentItem({ doc }) {
  return (
    <li>
      <a href={doc.file} target="_blank" rel="noopener noreferrer">
        {doc.id} - {doc.file.split("/").pop()} {/* filename from path */}
      </a>
    </li>
  );
}
