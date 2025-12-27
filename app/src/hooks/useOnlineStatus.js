import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [online, setOnline] = useState(true);

  async function checkInternet() {
    try {
      // lightweight request, cache-busted
      await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        cache: "no-store",
        mode: "no-cors"
      });
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkInternet();

    window.addEventListener("online", checkInternet);
    window.addEventListener("offline", () => setOnline(false));

    const interval = setInterval(checkInternet, 10000); // every 10s

    return () => {
      window.removeEventListener("online", checkInternet);
      window.removeEventListener("offline", () => setOnline(false));
      clearInterval(interval);
    };
  }, []);

  return online;
}
