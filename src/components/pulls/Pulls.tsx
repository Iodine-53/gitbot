import { mockPRs } from "../../lib/mockData";
import { PRListItem } from "../repo/PRListItem";

export function Pulls() {
  const allPRs = Object.values(mockPRs).flat();

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-300">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Pull Requests
        </h1>
      </header>

      <div className="space-y-3">
        {allPRs.length === 0 ? (
          <p className="text-[#8A93A3] text-sm text-center py-8">No open pull requests</p>
        ) : (
          allPRs.map((pr) => <PRListItem key={pr.id} pr={pr} />)
        )}
      </div>
    </div>
  );
}
