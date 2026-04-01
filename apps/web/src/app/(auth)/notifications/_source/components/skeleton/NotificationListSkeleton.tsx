const NotificationListSkeleton = () => {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-2xl bg-surface-container-low"
        />
      ))}
    </div>
  );
};
export default NotificationListSkeleton;
