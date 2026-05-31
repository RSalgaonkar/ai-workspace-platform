import {
  FileText,
  MessageCircle,
  SmilePlus
} from "lucide-react";

import { toast } from "sonner";

import {
  reactToMessage
} from "@/features/chat/api/chat.api";

import { Message } from "@/features/chat/types/chat.types";

type Props = {
  message: Message;
  onReply?: (message: Message) => void;
};

const reactionOptions = [
  "\u{1F44D}",
  "\u{1F525}",
  "\u{2705}"
];

export default function ChatMessage({
  message,
  onReply
}: Props) {
  const timestamp = new Date(
    message.createdAt
  );

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold text-white"
          aria-hidden="true"
        >
          {message.user.name
            .slice(0, 1)
            .toUpperCase()}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-950">
            {message.user.name}
          </h3>

          <time
            className="text-xs text-slate-500"
            dateTime={message.createdAt}
          >
            {timestamp.toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute: "2-digit"
              }
            )}
          </time>
        </div>
      </div>

      <p className="whitespace-pre-wrap break-words pl-12 text-sm leading-6 text-slate-700">
        {message.content}
      </p>

      {message.attachments &&
        message.attachments.length >
          0 && (
          <div className="mt-3 space-y-2 pl-12">
            {message.attachments.map(
              (attachment) => (
                <a
                  key={attachment.id}
                  href={
                    attachment.file.url
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <FileText
                    size={16}
                    aria-hidden="true"
                  />
                  {
                    attachment.file
                      .fileName
                  }
                </a>
              )
            )}
          </div>
        )}

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-12">
        {reactionOptions.map(
          (emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={async () => {
                try {
                  await reactToMessage(
                    message.id,
                    emoji
                  );
                  toast.success(
                    "Reaction updated"
                  );
                } catch {
                  toast.error(
                    "Reaction failed"
                  );
                }
              }}
              className="rounded-lg border border-slate-200 px-2 py-1 text-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label={`React with ${emoji}`}
            >
              {emoji}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onReply?.(message)}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <MessageCircle
            size={14}
            aria-hidden="true"
          />
          Reply
        </button>

        {message.reactions &&
          message.reactions.length >
            0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600">
              <SmilePlus
                size={13}
                aria-hidden="true"
              />
              {
                message.reactions
                  .length
              } reactions
            </span>
          )}
      </div>
    </article>
  );
}
