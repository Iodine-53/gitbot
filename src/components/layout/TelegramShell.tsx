import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, GitPullRequest, CircleDot, Settings } from "lucide-react";

export function BottomTabBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { icon: Home, label: "Home", path: "/" },
    { icon: GitPullRequest, label: "Pulls", path: "/pulls" },
    { icon: CircleDot, label: "Issues", path: "/issues" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0B0E13]/80 backdrop-blur-md border-t border-[#242B36] flex items-center justify-around px-2 z-50">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.path || (tab.path !== "/" && currentPath.startsWith(tab.path));
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors ${
              isActive ? "text-[#8B7FFF]" : "text-[#8A93A3] hover:text-[#E7EAF0]"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function TelegramShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Attempt to initialize Telegram WebApp if available
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor("#0B0E13");
      tg.setBackgroundColor("#0B0E13");
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0E13] text-[#E7EAF0] pb-16">
      <main className="flex-1 w-full max-w-md mx-auto relative">{children}</main>
      <BottomTabBar />
    </div>
  );
}
