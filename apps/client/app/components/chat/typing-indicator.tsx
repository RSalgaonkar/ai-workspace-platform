type Props = {
  users: string[];
};

export default function TypingIndicator({
  users
}: Props) {
  if (users.length === 0)
    return null;

  return (
    <div
      className="text-sm text-slate-500"
      role="status"
      aria-live="polite"
    >
      {users.join(", ")} typing...
    </div>
  );
}
