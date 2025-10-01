export default function DocumentButton({ doc, onOpen }) {
  return (
    <button
      className="bg-blue-500 text-white px-3 py-1 rounded m-1 hover:bg-blue-600"
      onClick={() => onOpen(doc)}
    >
      {doc.title}
    </button>
  );
}