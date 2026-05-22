type PresenceRecord = {
  userId: string;
  name: string;
  workspaceId: string;
  status: "online" | "away";
  isTyping?: boolean;
  typingChannelId?: string;
  cursor?: {
    documentId: string;
    x: number;
    y: number;
    selection?: string;
  };
  idleSince?: string;
  lastSeenAt: string;
};

const presence = new Map<
  string,
  PresenceRecord
>();

export const updatePresence = (
  record: PresenceRecord
) => {
  presence.set(
    `${record.workspaceId}:${record.userId}`,
    record
  );

  return record;
};

export const listPresence = (
  workspaceId: string
) => {
  const cutoff =
    Date.now() - 1000 * 60 * 5;

  return Array.from(
    presence.values()
  ).filter(
    (record) =>
      record.workspaceId ===
        workspaceId &&
      new Date(
        record.lastSeenAt
      ).getTime() >= cutoff
  );
};

export const listAwareness = (
  workspaceId: string
) => {
  const people =
    listPresence(workspaceId);

  return {
    people,
    typing: people.filter(
      (person) => person.isTyping
    ),
    cursors: people
      .filter((person) => person.cursor)
      .map((person) => ({
        userId: person.userId,
        name: person.name,
        cursor: person.cursor
      })),
    idle: people.filter(
      (person) =>
        person.status === "away" ||
        person.idleSince
    ),
    graph: Array.from({
      length: 12
    }).map((_, index) => ({
      label: `${index * 5}m`,
      activeUsers:
        index === 11
          ? people.length
          : Math.max(
              0,
              people.length -
                (11 - index)
            )
    }))
  };
};
