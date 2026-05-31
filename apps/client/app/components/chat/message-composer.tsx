"use client";

import { useState } from "react";

import {
  Paperclip,
  Send,
  X
} from "lucide-react";

import { toast } from "sonner";

import TextareaAutosize from "react-textarea-autosize";

import {
  sendMessage
} from "@/features/chat/api/chat.api";

import {
  useChatStore
} from "@/features/chat/store/chat.store";

import {
  uploadFile
} from "@/features/upload/api/upload.api";

import {
  useWorkspaceStore
} from "@/features/workspace/store/workspace.store";

type Props = {
  channelId: string;
  parentId?: string;
  replyingTo?: string | null;
  onCancelReply?: () => void;
  onSent?: () => void;
};

export default function MessageComposer({
  channelId,
  parentId,
  replyingTo,
  onCancelReply,
  onSent
}: Props) {
  const [message, setMessage] =
    useState("");
  const [isSending, setIsSending] =
    useState(false);
  const [files, setFiles] =
    useState<File[]>([]);

  const activeWorkspaceId =
    useWorkspaceStore(
      (state) =>
        state.activeWorkspaceId
    );

  const addMessage =
    useChatStore(
      (state) => state.addMessage
    );

  const handleSend =
    async () => {
      const trimmed =
        message.trim();

      if (
        (!trimmed &&
          files.length === 0) ||
        isSending
      )
        return;

      const optimisticMessage = {
        id: crypto.randomUUID(),
        content: trimmed,
        parentId,
        createdAt:
          new Date().toISOString(),
        user: {
          id: "me",
          name: "You"
        },
        attachments: files.map(
          (file) => ({
            id: `${file.name}-${file.size}`,
            file: {
              id: `${file.name}-${file.size}`,
              fileName: file.name,
              mimeType: file.type,
              size: file.size,
              url: "#"
            }
          })
        ),
        reactions: [],
        replies: []
      };

      addMessage(optimisticMessage);

      setMessage("");
      setIsSending(true);

      try {
        const uploaded =
          await Promise.all(
            files.map((file) =>
              uploadFile(
                file,
                activeWorkspaceId
              )
            )
          );

        await sendMessage({
          channelId,
          content: trimmed,
          parentId,
          attachmentIds: uploaded.map(
            (item) => item.data.id
          )
        });

        setFiles([]);
        onSent?.();
      } catch {
        toast.error(
          "Message could not be sent"
        );
      } finally {
        setIsSending(false);
      }
    };

  return (
    <div className="border-t border-slate-200 bg-white p-4">
      {replyingTo && (
        <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
          <span>
            Replying to {replyingTo}
          </span>
          <button
            type="button"
            onClick={onCancelReply}
            className="rounded-md p-1 text-slate-500 hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            aria-label="Cancel reply"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file) => (
            <span
              key={`${file.name}-${file.size}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {file.name}
              <button
                type="button"
                onClick={() =>
                  setFiles((current) =>
                    current.filter(
                      (item) =>
                        item !== file
                    )
                  )
                }
                aria-label={`Remove ${file.name}`}
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <label
          htmlFor="message-composer"
          className="sr-only"
        >
          Message
        </label>

        <TextareaAutosize
          id="message-composer"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message..."
          className="max-h-40 min-h-11 flex-1 resize-none rounded-lg border border-slate-300 bg-white p-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-900"
          aria-describedby="message-help"
        />

        <label className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-within:ring-2 focus-within:ring-slate-900">
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(event) => {
              setFiles(
                Array.from(
                  event.target.files ?? []
                )
              );
            }}
            aria-label="Attach files"
          />
          <Paperclip
            size={18}
            aria-hidden="true"
          />
        </label>

        <button
          type="button"
          onClick={handleSend}
          disabled={
            (!message.trim() &&
              files.length === 0) ||
            isSending
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Send message"
          aria-busy={isSending}
        >
          <Send
            size={18}
            aria-hidden="true"
          />
        </button>
      </div>

      <p
        id="message-help"
        className="mt-2 text-xs text-slate-500"
      >
        Press Enter to send, Shift+Enter for a new line.
      </p>
    </div>
  );
}
