import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useData } from "./data/store";

/**
 * Analytics — visitor session tracking.
 *
 * On mount a session is created in the data store. Page views are recorded on
 * every route change, and when a session exceeds 3 minutes it is marked as a
 * "long visit" and an admin notification is added. Traffic source and device
 * type are mocked for the preview; in production these would come from a real
 * analytics service (e.g. Plausible, GA4) or the backend.
 */

const LONG_VISIT_MS = 3 * 60 * 1000;

const MOCK_SOURCES = ["Direct", "Google", "Facebook", "Instagram", "Referral"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectDevice(): string {
  if (typeof window === "undefined") return "Desktop";
  const width = window.innerWidth;
  if (width < 768) return "Mobile";
  if (width < 1024) return "Tablet";
  return "Desktop";
}

function makeSessionId(): string {
  return `session-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function useAnalytics() {
  const { addSession, updateSession, addNotification } = useData();
  const location = useLocation();
  const sessionIdRef = useRef<string | null>(null);
  const startRef = useRef<number>(0);
  const pagesRef = useRef<string[]>([]);
  const longVisitFiredRef = useRef(false);
  const initialPathRef = useRef(location.pathname);

  // Create the session once on mount.
  useEffect(() => {
    const id = makeSessionId();
    sessionIdRef.current = id;
    startRef.current = Date.now();
    pagesRef.current = [initialPathRef.current];
    longVisitFiredRef.current = false;

    addSession({
      id,
      startTime: new Date().toISOString(),
      endTime: "",
      durationSec: 0,
      pageViews: 1,
      pages: [initialPathRef.current],
      source: pick(MOCK_SOURCES),
      device: detectDevice(),
      longVisit: false,
    });

    // Mark long visits after 3 minutes.
    const timer = window.setTimeout(() => {
      if (longVisitFiredRef.current) return;
      longVisitFiredRef.current = true;
      const durationSec = Math.round((Date.now() - startRef.current) / 1000);
      updateSession(id, {
        endTime: new Date().toISOString(),
        durationSec,
        pageViews: pagesRef.current.length,
        pages: pagesRef.current,
        longVisit: true,
      });
      addNotification(
        "A visitor stayed on the site for over 3 minutes (long visit).",
        "info",
      );
    }, LONG_VISIT_MS);

    return () => {
      window.clearTimeout(timer);
      // Finalize the session on unmount.
      const durationSec = Math.round((Date.now() - startRef.current) / 1000);
      updateSession(id, {
        endTime: new Date().toISOString(),
        durationSec,
        pageViews: pagesRef.current.length,
        pages: pagesRef.current,
        longVisit: longVisitFiredRef.current,
      });
    };
  }, [addSession, updateSession, addNotification]);

  // Track page views on route change.
  useEffect(() => {
    if (!sessionIdRef.current) return;
    if (!pagesRef.current.includes(location.pathname)) {
      pagesRef.current = [...pagesRef.current, location.pathname];
    }
    updateSession(sessionIdRef.current, {
      pageViews: pagesRef.current.length,
      pages: pagesRef.current,
    });
  }, [location.pathname, updateSession]);
}
