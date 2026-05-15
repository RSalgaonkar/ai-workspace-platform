type PresenceRecord = {
  userId: string;
  name: string;
  workspaceId: string;
  status: "online" | "away";
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
