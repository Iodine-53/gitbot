import { mockIssues } from "../../lib/mockData";
import { IssueListItem } from "../repo/IssueListItem";

export function Issues() {
  const allIssues = Object.values(mockIssues).flat();

  return (
    <div className="p-4 space-y-8 animate-in fade-in duration-300">
      <header className="pt-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-[#E7EAF0]">
          Issues
        </h1>
      </header>

      <div className="space-y-3">
        {allIssues.length === 0 ? (
          <p className="text-[#8A93A3] text-sm text-center py-8">No open issues</p>
        ) : (
          allIssues.map((issue) => <IssueListItem key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
}
