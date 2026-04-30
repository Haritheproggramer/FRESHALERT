import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const tips = [
  {
    icon: "📷",
    title: "Scan barcodes instantly",
    body: "Point your camera at any product barcode to auto-fill name and expiry date.",
  },
  {
    icon: "🔔",
    title: "Custom reminders",
    body: "Set alerts from 1 hour to 7 days before expiry. Never waste food again.",
  },
  {
    icon: "📊",
    title: "Track waste savings",
    body: "See how much you save by using products before they expire.",
  },
];

export function SplashPage() {
  const [tipIndex, setTipIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  // Auto-advance to dashboard after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/" }), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showContent) return;
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showContent]);

  return (
    <div
      className="min-h-screen w-full max-w-[428px] mx-auto flex flex-col items-center justify-between px-6 py-12 bg-background overflow-hidden"
      data-ocid="splash.page"
    >
      {/* Hero logo section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="relative flex items-center justify-center w-28 h-28 rounded-3xl shadow-xl"
          style={{
            background: "var(--gradient-safe)",
          }}
        >
          <span className="text-6xl" role="img" aria-label="Fresh leaf">
            🌿
          </span>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-3xl"
            style={{ boxShadow: "var(--shadow-glow)" }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-center"
        >
          <h1 className="text-heading-lg text-foreground">FreshAlert</h1>
          <p className="mt-2 text-body-lg text-muted-foreground">
            Track expiry, save money &amp; stay healthy
          </p>
        </motion.div>

        {/* Tip cards */}
        {showContent && (
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="card-neumorphic p-5 w-full mt-4"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0" aria-hidden="true">
                {tips[tipIndex].icon}
              </span>
              <div>
                <p className="font-display font-semibold text-base text-foreground">
                  {tips[tipIndex].title}
                </p>
                <p className="text-body-md text-muted-foreground mt-1">
                  {tips[tipIndex].body}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tip dots */}
        {showContent && (
          <div className="flex gap-2 mt-2" aria-hidden="true">
            {tips.map((tip, i) => (
              <button
                key={tip.title}
                type="button"
                onClick={() => setTipIndex(i)}
                className={[
                  "w-2 h-2 rounded-full transition-smooth",
                  i === tipIndex ? "bg-primary w-5" : "bg-muted-foreground/30",
                ].join(" ")}
                aria-label={`Tip ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full flex flex-col gap-3"
      >
        <Link
          to="/"
          className="btn-primary flex items-center justify-center gap-2 text-base"
          data-ocid="splash.get_started_button"
        >
          Get Started →
        </Link>
        <p className="text-center text-body-sm text-muted-foreground">
          No account needed · Free forever
        </p>
      </motion.div>
    </div>
  );
}
