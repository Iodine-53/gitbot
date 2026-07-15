export function HealthBar({ ratio }: { ratio: number }) {
  const safeRatio = Math.max(0, Math.min(1, ratio));
  const successWidth = `${safeRatio * 100}%`;
  const dangerWidth = `${(1 - safeRatio) * 100}%`;

  return (
    <div className="flex w-full h-1 bg-[#242B36] rounded-full overflow-hidden">
      <div
        style={{ width: successWidth }}
        className="h-full bg-[#3FD68B] transition-all duration-300"
      />
      <div
        style={{ width: dangerWidth }}
        className="h-full bg-[#FF6B6B] transition-all duration-300"
      />
    </div>
  );
}
