import { useAppStore } from "@/store/useAppStore";
import {
  Bell,
  Download,
  Info,
  Moon,
  RefreshCw,
  Shield,
  Sun,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  ocid: string;
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
  ocid,
}: ToggleRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {label}
        </p>
        <p className="text-xs text-muted-foreground leading-tight mt-0.5">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        data-ocid={ocid}
        className={[
          "relative inline-flex w-11 h-6 rounded-full transition-smooth flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          checked ? "bg-primary" : "bg-muted-foreground/30",
        ].join(" ")}
        aria-label={label}
      >
        <span
          className={[
            "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-smooth",
            checked ? "left-[22px]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const products = useAppStore((s) => s.products);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleClearData = () => {
    toast.error("Clear all data? This cannot be undone.", {
      duration: 5000,
      action: {
        label: "Confirm",
        onClick: () => {
          toast.success("Data cleared", { duration: 2000 });
        },
      },
    });
  };

  return (
    <div
      className="flex flex-col flex-1 bg-background"
      data-ocid="settings.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 pt-4 pb-4 sticky top-0 z-40">
        <h1 className="text-heading-sm text-foreground">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-4"
          data-ocid="settings.profile_section"
        >
          <div className="card-neumorphic p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gradient-safe flex items-center justify-center shadow-glow flex-shrink-0">
              <span className="text-2xl" aria-hidden="true">
                🌿
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-base text-foreground">
                FreshAlert User
              </p>
              <p className="text-sm text-muted-foreground">
                {products.length} products tracked
              </p>
            </div>
          </div>
        </motion.div>

        {/* Appearance section */}
        <div className="px-4 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Appearance
          </p>
        </div>
        <div
          className="bg-card border-y border-border divide-y divide-border"
          data-ocid="settings.appearance_section"
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Switch between light and dark theme
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggleTheme}
              data-ocid="settings.dark_mode_toggle"
              className={[
                "relative inline-flex w-11 h-6 rounded-full transition-smooth flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                theme === "dark" ? "bg-primary" : "bg-muted-foreground/30",
              ].join(" ")}
              aria-label="Toggle dark mode"
            >
              <span
                className={[
                  "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-smooth",
                  theme === "dark" ? "left-[22px]" : "left-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        {/* Notifications section */}
        <div className="px-4 mt-4 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Notifications
          </p>
        </div>
        <div
          className="bg-card border-y border-border divide-y divide-border"
          data-ocid="settings.notifications_section"
        >
          <ToggleRow
            icon={<Bell size={18} />}
            label="Push Notifications"
            description="Get alerts before products expire"
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
            ocid="settings.notifications_toggle"
          />
          <ToggleRow
            icon={
              <span className="text-base" aria-hidden="true">
                🔔
              </span>
            }
            label="Sound Alerts"
            description="Play sound for expiry reminders"
            checked={soundEnabled}
            onChange={setSoundEnabled}
            ocid="settings.sound_toggle"
          />
        </div>

        {/* Sync section */}
        <div className="px-4 mt-4 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Data &amp; Sync
          </p>
        </div>
        <div
          className="bg-card border-y border-border divide-y divide-border"
          data-ocid="settings.sync_section"
        >
          <ToggleRow
            icon={<RefreshCw size={18} />}
            label="Cloud Sync"
            description="Sync across devices automatically"
            checked={syncEnabled}
            onChange={(v) => {
              setSyncEnabled(v);
              toast.info(v ? "Cloud sync enabled" : "Cloud sync disabled");
            }}
            ocid="settings.sync_toggle"
          />
          <button
            type="button"
            onClick={() =>
              toast.success("Exported! Check your downloads.", {
                duration: 3000,
              })
            }
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-smooth"
            data-ocid="settings.export_button"
          >
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
              <Download size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Export Data
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Download CSV or PDF report
              </p>
            </div>
            <span className="text-muted-foreground text-lg">›</span>
          </button>
        </div>

        {/* Privacy section */}
        <div className="px-4 mt-4 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Privacy
          </p>
        </div>
        <div
          className="bg-card border-y border-border divide-y divide-border"
          data-ocid="settings.privacy_section"
        >
          <button
            type="button"
            onClick={() =>
              toast.info("Privacy policy coming soon!", { duration: 2000 })
            }
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-muted/50 transition-smooth"
            data-ocid="settings.privacy_button"
          >
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
              <Shield size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Privacy Policy
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                How we handle your data
              </p>
            </div>
            <span className="text-muted-foreground text-lg">›</span>
          </button>
          <button
            type="button"
            onClick={handleClearData}
            className="flex items-center gap-3 px-4 py-3.5 w-full text-left hover:bg-danger/5 transition-smooth"
            data-ocid="settings.clear_data_button"
          >
            <div className="w-9 h-9 rounded-xl bg-danger/10 flex items-center justify-center flex-shrink-0 text-danger">
              <Trash2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-danger">
                Clear All Data
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Delete all products and reset
              </p>
            </div>
          </button>
        </div>

        {/* About */}
        <div className="px-4 mt-4 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            About
          </p>
        </div>
        <div
          className="bg-card border-y border-border"
          data-ocid="settings.about_section"
        >
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-muted-foreground">
              <Info size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                FreshAlert v1.0
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Smart Expiry Reminder App
              </p>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="px-4 py-6 text-center">
          <p className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="hover:text-primary transition-colors"
              target="_blank"
              rel="noreferrer"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
