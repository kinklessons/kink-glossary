import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function JsonSearchApp() {
  const [data, setData] = useState([]);
  const [deleteIds, setDeleteIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load main data
  useEffect(() => {
    fetch("./questionnaires/v3.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error loading v3.json:", err));
  }, []);

  // Load delete list
  useEffect(() => {
    fetch("./questionnaires/delete.json")
      .then((res) => res.json())
      .then((items) => {
        setDeleteIds(new Set(items.map((i) => i.id)));
      })
      .catch((err) => console.error("Error loading delete.json:", err));
  }, []);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  // escape regex
  const escapeRegExp = (str = "") =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // categories
  const categories = useMemo(() => {
    return ["All", ...new Set(data.map((d) => d.Category))];
  }, [data]);

  // filter
  const filteredData = useMemo(() => {
    const s = debouncedQuery.toLowerCase();

    return data.filter((item) => {
      if (deleteIds.has(item.id)) return false;

      const matchesSearch =
        item.Question.toLowerCase().includes(s) ||
        item.Category.toLowerCase().includes(s) ||
        item.Definition.toLowerCase().includes(s);

      const matchesCategory =
        selectedCategory === "All" || item.Category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, deleteIds, debouncedQuery, selectedCategory]);

  // highlight
  const highlightText = (text = "") => {
    if (!debouncedQuery) return text;

    const safe = escapeRegExp(debouncedQuery);
    const regex = new RegExp(`(${safe})`, "gi");

    return text.split(regex).map((part, i) =>
      part.toLowerCase() === debouncedQuery.toLowerCase() ? (
        <mark key={i}>{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Definition Search</h1>

      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="mb-3"
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <p className="mb-4 text-sm text-gray-600">
        {filteredData.length} result{filteredData.length !== 1 && "s"}
      </p>

<div className="space-y-4">
  {displayData.map((item) => (
    <div
      key={item.id}
      className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900">
        {highlightText(item.Question)}
      </h2>

      {/* Category badge */}
      <div className="mt-1 mb-3">
        <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
          {item.Category}
        </span>
      </div>

      {/* Definition */}
      <p className="text-sm leading-relaxed text-gray-600">
        {highlightText(item.Definition || "No definition available")}
      </p>
    </div>
  ))}
</div>

    </div>
  );
}
