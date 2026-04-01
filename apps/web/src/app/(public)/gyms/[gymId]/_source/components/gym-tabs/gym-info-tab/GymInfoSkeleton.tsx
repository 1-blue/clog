const GymInfoSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse pb-24">
      <div className="h-14 bg-surface-container-high/50" />
      <div className="h-[min(440px,55vh)] bg-surface-container-high" />
      <div className="space-y-4 px-6 py-8">
        <div className="flex gap-4">
          <div className="size-11 shrink-0 rounded-full bg-surface-container-low" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 w-12 rounded bg-surface-container-low" />
            <div className="h-4 w-full rounded bg-surface-container-low" />
          </div>
        </div>
        <div className="h-48 rounded-2xl bg-surface-container-low" />
      </div>
    </div>
  );
};

export default GymInfoSkeleton;
