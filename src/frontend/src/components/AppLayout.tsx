import { BottomNav } from "@/components/BottomNav";
import { useRouterState } from "@tanstack/react-router";

interface AppLayoutProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideBottomNav = false }: AppLayoutProps) {
  const routerState = useRouterState();
  const activeRoute = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-background flex items-start justify-center">
      {/* Mobile phone frame — max 428px, full height */}
      <div
        className="relative w-full max-w-[428px] min-h-screen flex flex-col bg-background overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {/* Safe area top */}
        <div
          className="flex-shrink-0 bg-card"
          style={{ height: "env(safe-area-inset-top)" }}
          aria-hidden="true"
        />

        {/* Main scrollable content */}
        <main
          className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden${hideBottomNav ? "" : " pb-20"}`}
        >
          {children}
        </main>

        {/* Bottom navigation */}
        {!hideBottomNav && <BottomNav activeRoute={activeRoute} />}

        {/* Branding footer — hidden on mobile to save space, shown in settings */}
      </div>
    </div>
  );
}
