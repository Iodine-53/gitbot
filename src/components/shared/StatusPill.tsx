import { ReactNode } from "react";

export function StatusPill({
  status,
  label,
}: {
  status: "success" | "danger" | "warning" | "neutral";
  label: string;
}) {
  const colors = {
    success: "bg-[#3FD68B]/15 text-[#3FD68B] border-[#3FD68B]/30",
    danger: "bg-[#FF6B6B]/15 text-[#FF6B6B] border-[#FF6B6B]/30",
    warning: "bg-[#F2A93B]/15 text-[#F2A93B] border-[#F2A93B]/30",
    neutral: "bg-[#242B36]/50 text-[#8A93A3] border-[#242B36]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${colors[status]}`}
    >
      {label}
    </span>
  );
}
