export default function Pagination({ page, totalPages, total, limit, skip, onPageChange, onLimitChange }) {
  if (total === 0) return null;

  const start = skip + 1;
  const end = Math.min(skip + limit, total);

  // Simple page numbers list banate hain (max 5 dikhayenge taaki UI saaf rahe)
  const pageNumbers = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <p className="text-sm text-gray-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          Previous
        </button>

        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 border rounded ${
              p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-100"
        >
          Next
        </button>
      </div>

      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={50}>50 / page</option>
      </select>
    </div>
  );
}