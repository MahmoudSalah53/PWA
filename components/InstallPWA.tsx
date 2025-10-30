"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X, Download } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (checkInstalled) {
      setIsInstalled(true);
      sessionStorage.setItem("pwaDismissedUntil", "installed");
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);

      const dismissedUntil = sessionStorage.getItem("pwaDismissedUntil");
      const now = Date.now();

      if (!dismissedUntil || (dismissedUntil !== "installed" && now > Number(dismissedUntil))) {
        setShowInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const dismissedUntil = sessionStorage.getItem("pwaDismissedUntil");
    const now = Date.now();

    if (dismissedUntil === "installed") {
      setShowInstall(false);
      return;
    }

    if (dismissedUntil && now < Number(dismissedUntil)) {
      setShowInstall(false);
    }
  }, [pathname]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("✅ User accepted the install prompt");
    } else {
      console.log("❌ User dismissed the install prompt");
      sessionStorage.setItem("pwaDismissedUntil", String(Date.now() + 5 * 60 * 1000));
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleCancel = () => {
    setShowInstall(false);
    sessionStorage.setItem("pwaDismissedUntil", String(Date.now() + 5 * 60 * 1000));
  };

  useEffect(() => {
    window.addEventListener("appinstalled", () => {
      console.log("App installed successfully!");
      setIsInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
      sessionStorage.setItem("pwaDismissedUntil", "installed");
    });
  }, []);

  if (!showInstall || isInstalled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="relative animate-slide-in-right">
        {/* Background with glassmorphism effect */}
        <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 backdrop-blur-xl border border-zinc-700/50 rounded-xl shadow-2xl overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>
          
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm -z-10 animate-pulse"></div>
          
          {/* Content */}
          <div className="relative p-4">
            <div className="flex items-start gap-3 mb-3">
              {/* Icon with animated gradient */}
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 animate-bounce-slow">
                <Download className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-white mb-1 tracking-tight">
                  Install TSTCommerce
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Get instant access with our PWA
                </p>
              </div>
              
              {/* Close button */}
              <button
                onClick={handleCancel}
                className="flex-shrink-0 w-7 h-7 rounded-lg hover:bg-zinc-700/50 transition-colors duration-200 flex items-center justify-center group"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-blue-500/25"
              >
                Install Now
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 active:scale-95"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}