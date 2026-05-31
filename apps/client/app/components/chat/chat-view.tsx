"use client";

import {
  useEffect,
  useState
} from "react";

import {
  AlertCircle,
  MessageSquare,
  RefreshCcw
} from "lucide-react";

import {
  useChatStore
} from "@/features/chat/store/chat.store";

import {
  getMessages
} from "@/features/chat/api/chat.api";

import ChatMessage from "./chat-message";

import MessageComposer from "./message-composer";

import TypingIndicator from "./typing-indicator";

import {
  useSocket
} from "../providers/socket-provider";

type Props = {
  channelId: string;
};

export default function ChatView({
  channelId
}: Props) {
  const socket = useSocket();
  const [isLoading, setIsLoading] =
    useState(true);
  const [hasError, setHasError] =
    useState(false);
  const [refreshKey, setRefreshKey] =
    useState(0);
  const [replyingTo, setReplyingTo] =
    useState<{
      id: string;
      name: string;
    } | null>(null);

  const {
    messages,
    setMessages,
    addMessage,
    typingUsers
  } = useChatStore();

  useEffect(() => {
    let isMounted = true;

    const load =
      async () => {
        setIsLoading(true);
        setHasError(false);

        try {
          const response =
            await getMessages(
              channelId
            );

          if (isMounted) {
            setMessages(
              response.data
            );
          }
        } catch {
          if (isMounted) {
            setMessages([]);
            setHasError(true);
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

    load();

    return () => {
      isMounted = false;
    };
  }, [
    channelId,
    refreshKey,
    setMessages
  ]);

  useEffect(() => {
    if (!socket) return;

    socket.emit(
      "join-workspace",
      channelId
    );

    socket.on(
      "new-message",
      (message) => {
        addMessage(message);
      }
    );

    return () => {
      socket.off(
        "new-message"
      );
    };
  }, [socket, addMessage, channelId]);

  return (
    <section
      className="flex min-h-0 flex-1 flex-col bg-white text-slate-950"
      aria-label="Channel conversation"
    >
      <div
        className="flex-1 space-y-4 overflow-y-auto p-6"
        aria-live="polite"
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div
            className="space-y-3"
            aria-label="Loading messages"
          >
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-lg bg-slate-100"
                aria-hidden="true"
              />
            ))}
          </div>
        ) : hasError ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <AlertCircle
              size={28}
              className="text-amber-600"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-lg font-semibold text-slate-950">
              Messages could not be loaded
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Check that the backend is running and that this account has access to the selected workspace.
            </p>
            <button
              type="button"
              onClick={() => {
                setRefreshKey(
                  (current) =>
                    current + 1
                );
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              <RefreshCcw
                size={16}
                aria-hidden="true"
              />
              Refresh messages
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <MessageSquare
              size={30}
              className="text-slate-400"
              aria-hidden="true"
            />
            <h2 className="mt-3 text-lg font-semibold text-slate-950">
              No messages yet
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Start the conversation with a project update, question, or decision for the team.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onReply={(target) =>
                setReplyingTo({
                  id: target.id,
                  name: target.user.name
                })
              }
            />
          ))
        )}
      </div>

      <div className="px-4 pb-2">
        <TypingIndicator
          users={typingUsers}
        />
      </div>

      <MessageComposer
        channelId={channelId}
        parentId={
          replyingTo?.id
        }
        replyingTo={
          replyingTo?.name
        }
        onCancelReply={() =>
          setReplyingTo(null)
        }
        onSent={() => {
          setReplyingTo(null);
          setRefreshKey(
            (current) =>
              current + 1
          );
        }}
      />
    </section>
  );
}
