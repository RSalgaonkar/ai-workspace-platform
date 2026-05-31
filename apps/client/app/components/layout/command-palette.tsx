"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  ArrowRight,
  Bot,
  Gauge,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  Users,
  X
} from "lucide-react";

import {
  useRouter
} from "next/navigation";

const commands = [
  {
    label: "Open dashboard",
    description:
      "View portfolio metrics and system readiness",
    href: "/dashboard",
    icon: LayoutDashboard,
    keywords:
      "home overview metrics portfolio"
  },
  {
    label: "Open workspace",
    description:
      "Manage channels, documents, analytics, and AI tools",
    href: "/workspace",
    icon: Users,
    keywords:
      "workspace tenant collaboration"
  },
  {
    label: "Open chat",
    description:
      "Continue threaded conversations and attachments",
    href: "/chat",
    icon: MessageSquare,
    keywords:
      "messages threads realtime"
  },
  {
    label: "Open settings",
    description:
      "Edit profile, members, invitations, and tenant settings",
    href: "/settings",
    icon: Settings,
    keywords:
      "profile permissions invitations"
  },
  {
    label: "Review AI capabilities",
    description:
      "Jump to workspace AI assistant and search surfaces",
    href: "/workspace",
    icon: Bot,
    keywords:
      "assistant semantic search ai"
  },
  {
    label: "Check deployment readiness",
    description:
      "Return to production checklist and health panels",
    href: "/dashboard",
    icon: Gauge,
    keywords:
      "vercel health ci deployment"
  }
];

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] =
    useState(false);
  const [query, setQuery] =
    useState("");

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setIsOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, []);

  const results = useMemo(() => {
    const normalized =
      query.trim().toLowerCase();

    if (!normalized) {
      return commands;
    }

    return commands.filter((command) =>
      [
        command.label,
        command.description,
        command.keywords
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [query]);

  const runCommand = (href: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-lg transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 lg:flex"
        aria-label="Open command palette"
      >
        <Search
          size={16}
          aria-hidden="true"
        />
        Search
        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
          Ctrl K
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="command-palette-title"
        >
          <div className="mx-auto mt-20 max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
              <Search
                size={18}
                className="text-slate-400"
                aria-hidden="true"
              />
              <label
                htmlFor="command-search"
                className="sr-only"
              >
                Search commands
              </label>
              <input
                id="command-search"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                autoFocus
                placeholder="Search commands, pages, or workflows"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                aria-label="Close command palette"
              >
                <X
                  size={17}
                  aria-hidden="true"
                />
              </button>
            </div>

            <h2
              id="command-palette-title"
              className="sr-only"
            >
              Command palette
            </h2>

            <div className="max-h-[420px] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">
                  No matching command found.
                </p>
              ) : (
                results.map((command) => {
                  const Icon = command.icon;

                  return (
                    <button
                      key={command.label}
                      type="button"
                      onClick={() =>
                        runCommand(
                          command.href
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                        <Icon
                          size={18}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-950">
                          {command.label}
                        </span>
                        <span className="block text-xs leading-5 text-slate-500">
                          {command.description}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-400"
                        aria-hidden="true"
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
