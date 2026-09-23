export default function EmptyState({ message }) {
  return (
    <div className="flex justify-center items-center py-16 text-gray-500">
      {message || "No data found."}
    </div>
  );
}