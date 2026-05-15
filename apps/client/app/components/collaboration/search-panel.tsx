"use client";

import {
  useState
} from "react";

import {
  Search
} from "lucide-react";

import {
  searchWorkspace
} from "@/features/collaboration/api/collaboration.api";

export default function SearchPanel() {
  const [query, setQuery] =
    useState("");
  const [count, setCount] =
    useState<number | null>(null);

  const runSearch = async () => {
    if (!query.trim()) {
      setCount(null);
      return;
    }

    const response =
      await searchWorkspace(query);

    setCount(
      response.data.messages.length +
        response.data.documents.length +
        response.data.workspaces.length
    );
  };

  return (
    <section
      className="rounded-lg border border-slate-200 bg-white p-4"
      aria-labelledby="search-title"
    >
      <div className="flex items-center gap-2">
        <Search
          size={17}
          className="text-slate-500"
          aria-hidden="true"
        />
        <h2
          id="search-title"
          className="text-sm font-semibold text-slate-950"
        >
          Search
        </h2>
      </div>

      <label
        htmlFor="workspace-search"
        className="sr-only"
      >
        Search workspace
      </label>
      <input
        id="workspace-search"
        value={query}
        onChange={(event) =>
          setQuery(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            runSearch();
          }
        }}
        placeholder="Search messages, docs..."
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900"
      />

      <p className="mt-3 text-sm text-slate-500">
        {count === null
          ? "Press Enter to search."
          : `${count} result${count === 1 ? "" : "s"} found.`}
      </p>
    </section>
  );
}
