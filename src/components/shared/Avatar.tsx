export function Avatar({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "w-5 h-5 text-[9px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full text-white font-medium ${sizes[size]} ${color}`}
    >
      {initials}
    </div>
  );
}
