export default function TableSkeleton({
  columns = 5,
  rows = 8,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div className="overflow-hidden rounded-[8px] border border-[#d8dfdf] bg-white">
      <table className="min-w-[900px] w-full border-collapse">
        <thead>
          <tr className="border-b border-[#d8dfdf] bg-white">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b border-[#d8dfdf]">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="px-4 py-4">
                  <div
                    className="h-4 bg-gray-200 rounded animate-pulse mx-auto"
                    style={{ width: colIdx === 0 ? "70%" : "50%" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
