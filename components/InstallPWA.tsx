"use client";

import { useEffect, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstall(false);
    }

    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-bold mb-1">Install TSTCommerce</h3>
          <p className="text-sm text-gray-300">
            Install our app for a better shopping experience!
          </p>
        </div>
        <button
          onClick={() => setShowInstall(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="flex-1 bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
        >
          Install
        </button>
        <button
          onClick={() => setShowInstall(false)}
          className="px-4 py-2 rounded border border-gray-600 hover:bg-gray-800 transition"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}