"use client";

import {
  useState
} from "react";

import {
  Search,
  Sparkles
} from "lucide-react";

import {
  searchWorkspace
} from "@/features/collaboration/api/collaboration.api";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

type Result = {
  id: string;
  type: string;
  title: string;
  snippet: string;
  score: number;
};

export default function SearchPanel() {
  const [query, setQuery] =
    useState("");
  const [results, setResults] =
    useState<Result[]>([]);
  const [ranking, setRanking] =
    useState("hybrid");

  const activeWorkspaceId =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceId
    );

  const runSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const response =
      await searchWorkspace(
        query,
        activeWorkspaceId
      );

    setResults(response.data.results);
    setRanking(response.data.ranking);
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
          AI Search
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
        placeholder="Search messages, files, docs..."
        className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-900"
      />

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
        <Sparkles
          size={13}
          aria-hidden="true"
        />
        {ranking}
      </div>

      <div className="mt-4 space-y-2">
        {results.length === 0 ? (
          <p className="text-sm text-slate-500">
            Search combines indexed messages, documents, attachments, and fuzzy ranking.
          </p>
        ) : (
          results.slice(0, 5).map((result) => (
            <article
              key={`${result.type}-${result.id}`}
              className="rounded-lg border border-slate-200 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {result.title}
                </p>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {result.type}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                {result.snippet}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
