"use client";

import {
  useState
} from "react";

import {
  Bot,
  Sparkles
} from "lucide-react";

import {
  askAssistant
} from "@/features/collaboration/api/collaboration.api";

type Props = {
  workspaceId?: string | null;
};

export default function AiAssistantPanel({
  workspaceId
}: Props) {
  const [answer, setAnswer] =
    useState(
      "Ask for a summary, action plan, or decision log."
    );

  const ask = async () => {
    const response =
      await askAssistant({
        workspaceId,
        prompt:
          "Summarize current workspace progress"
      });

    setAnswer(response.data.answer);
  };

  return (
    <section
      className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white"
      aria-labelledby="ai-assistant-title"
    >
      <div className="flex items-center gap-2">
        <Bot
          size={17}
          className="text-slate-300"
          aria-hidden="true"
        />
        <h2
          id="ai-assistant-title"
          className="text-sm font-semibold"
        >
          AI assistant
        </h2>
      </div>

      <p
        className="mt-3 text-sm leading-6 text-slate-300"
        aria-live="polite"
      >
        {answer}
      </p>

      <button
        type="button"
        onClick={ask}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Sparkles
          size={15}
          aria-hidden="true"
        />
        Generate brief
      </button>
    </section>
  );
}
