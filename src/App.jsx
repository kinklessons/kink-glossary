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
        {filteredData.map((item) => (
          <Card key={item.id} className="rounded-2xl shadow">
            <CardContent className="p-4">
              <p className="font-semibold">
                {highlightText(item.Question)}
              </p>
              <p className="text-sm text-gray-500">
                Category: {highlightText(item.Category)}
              </p>
              <p className="mt-2">
                {highlightText(item.Definition || "No definition available")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
