import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Settings, TrendingUp } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  to: string;
  ocid: string;
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, to: "/", ocid: "nav.home_tab" },
  {
    label: "Categories",
    icon: LayoutGrid,
    to: "/categories",
    ocid: "nav.categories_tab",
  },
  { label: "Stats", icon: TrendingUp, to: "/stats", ocid: "nav.stats_tab" },
  {
    label: "Settings",
    icon: Settings,
    to: "/settings",
    ocid: "nav.settings_tab",
  },
];

interface BottomNavProps {
  activeRoute: string;
}

export function BottomNav({ activeRoute }: BottomNavProps) {
  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      data-ocid="bottom_nav"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ label, icon: Icon, to, ocid }) => {
          const isActive =
            to === "/"
              ? activeRoute === "/" || activeRoute === ""
              : activeRoute.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              data-ocid={ocid}
              className={[
                "flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-smooth min-w-0 min-h-[44px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={[
                  "flex items-center justify-center w-10 h-6 rounded-full transition-smooth",
                  isActive ? "bg-primary/15" : "",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "animate-scale-in" : ""}
                  aria-hidden="true"
                />
              </div>
              <span
                className={[
                  "text-[10px] font-semibold tracking-wide leading-none transition-smooth",
                  isActive ? "text-primary" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
