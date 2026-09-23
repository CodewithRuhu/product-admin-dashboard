"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar({ initialValue, onSearch }) {
  const [text, setText] = useState(initialValue || "");
  const debouncedText = useDebounce(text, 500);

  // Jab debounced value change ho (typing ruk gayi ke 500ms baad),
  // parent ko bata do naya search query kya hai.
  useEffect(() => {
    onSearch(debouncedText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search products..."
      className="w-full sm:w-64 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}