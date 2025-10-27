"use client";

import { useEffect, useState } from "react";

export default function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          
          newWorker?.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setShowUpdate(true);
            }
          });
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-1">Update Available!</h3>
      <p className="text-sm mb-3">
        A new version of TSTCommerce is available.
      </p>
      <button
        onClick={handleUpdate}
        className="w-full bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
      >
        Update Now
      </button>
    </div>
  );
}