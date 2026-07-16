/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { TelegramShell } from "./components/layout/TelegramShell";
import { Dashboard } from "./components/dashboard/Dashboard";
import { RepoDetail } from "./components/repo/RepoDetail";
import { PRDetail } from "./components/pr-detail/PRDetail";
import { IssueDetail } from "./components/issue-detail/IssueDetail";
import { Settings } from "./components/settings/Settings";
import { Pulls } from "./components/pulls/Pulls";
import { Issues } from "./components/issues/Issues";

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <TelegramShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pulls" element={<Pulls />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/repo/:repoId" element={<RepoDetail />} />
            <Route path="/repo/:repoId/pr/:prId" element={<PRDetail />} />
            <Route path="/repo/:repoId/issue/:issueId" element={<IssueDetail />} />
          </Routes>
        </TelegramShell>
      </BrowserRouter>
    </AppContextProvider>
  );
}
