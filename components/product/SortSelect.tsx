"use client";

export default function SortSelect({ current }: { current?: string }) {
  const options = [
    { value: "newest", label: "Новинки" },
    { value: "price_asc", label: "Ціна ↑" },
    { value: "price_desc", label: "Ціна ↓" },
    { value: "rating", label: "За рейтингом" },
  ];
  return (
    <select
      defaultValue={current ?? "newest"}
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set("sort", e.target.value);
        window.location.href = url.toString();
      }}
      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-300"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
