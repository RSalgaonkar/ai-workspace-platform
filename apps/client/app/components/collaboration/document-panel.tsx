"use client";

import {
  useEffect,
  useState
} from "react";

import {
  FileText,
  Plus
} from "lucide-react";

import {
  createDocument,
  getDocuments
} from "@/features/collaboration/api/collaboration.api";

type DocumentItem = {
  id: string;
  title: string;
  updatedAt: string;
};

type Props = {
  workspaceId?: string | null;
};

export default function DocumentPanel({
  workspaceId
}: Props) {
  const [documents, setDocuments] =
    useState<DocumentItem[]>([]);

  useEffect(() => {
    if (!workspaceId) return;

    getDocuments(workspaceId)
      .then((response) =>
        setDocuments(response.data)
      )
      .catch(() => setDocuments([]));
  }, [workspaceId]);

  const create = async () => {
    if (!workspaceId) return;

    const response =
      await createDocument({
        workspaceId,
        title: "Project Brief",
        content:
          "Collaborative notes start here."
      });

    setDocuments((current) => [
      response.data,
      ...current
    ]);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText
            size={17}
            className="text-slate-500"
            aria-hidden="true"
          />
          <h2 className="text-sm font-semibold text-slate-950">
            Docs
          </h2>
        </div>
        <button
          type="button"
          onClick={create}
          className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          aria-label="Create document"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {documents.length === 0 ? (
          <p className="text-sm leading-6 text-slate-500">
            Create shared briefs, specs, and meeting notes.
          </p>
        ) : (
          documents.slice(0, 4).map((document) => (
            <div
              key={document.id}
              className="rounded-lg bg-slate-50 p-3"
            >
              <p className="text-sm font-medium text-slate-800">
                {document.title}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Updated{" "}
                {new Date(
                  document.updatedAt
                ).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
