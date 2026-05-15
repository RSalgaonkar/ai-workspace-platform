export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-10 rounded bg-gray-200" />

      <div className="h-32 rounded bg-gray-200" />

      <div className="h-32 rounded bg-gray-200" />
    </div>
  );
}