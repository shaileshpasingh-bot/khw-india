import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type DataState, seedData } from "./mockData";

/**
 * DataProvider — a localStorage-backed store for all user-generated content.
 *
 * Every form submission across the app writes through this context so the
 * admin dashboard reflects changes live. In production this would be replaced
 * by backend canister calls; the shape of the actions is designed to map 1:1.
 */

const STORAGE_KEY = "khw.data.v1";

type EntityKey = keyof DataState;

export interface DataContextValue {
  data: DataState;
  // Generic CRUD helpers
  addItem: <K extends EntityKey>(key: K, item: DataState[K][number]) => void;
  updateItem: <K extends EntityKey>(
    key: K,
    id: string,
    patch: Partial<DataState[K][number]>,
  ) => void;
  deleteItem: <K extends EntityKey>(key: K, id: string) => void;
  // Notifications log
  addNotification: (
    message: string,
    type?: "info" | "success" | "warning",
  ) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  // Convenience helpers
  addDonation: (donation: DataState["donations"][number]) => void;
  addContactSubmission: (
    submission: DataState["contactSubmissions"][number],
  ) => void;
  addNewsletterSubscriber: (
    subscriber: DataState["newsletterSubscribers"][number],
  ) => boolean;
  addVolunteerApplication: (
    application: DataState["volunteerApplications"][number],
  ) => void;
  addEventRegistration: (
    registration: DataState["eventRegistrations"][number],
  ) => void;
  addSession: (session: DataState["sessions"][number]) => void;
  updateSession: (id: string, patch: Partial<VisitorSessionPatch>) => void;
  resetData: () => void;
}

// A subset of session fields that analytics may update after creation.
export interface VisitorSessionPatch {
  endTime: string;
  durationSec: number;
  pageViews: number;
  pages: string[];
  longVisit: boolean;
}

function loadInitialData(): DataState {
  if (typeof window === "undefined") return seedData;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DataState>;
      // Merge with seed so newly added seed fields still appear.
      return { ...seedData, ...parsed };
    }
  } catch {
    // Ignore corrupt storage and fall back to seed.
  }
  return seedData;
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataState>(loadInitialData);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage may be unavailable (private mode); the in-memory store still works.
    }
  }, [data]);

  const addItem = useCallback(
    <K extends EntityKey>(key: K, item: DataState[K][number]) => {
      setData((prev) => ({
        ...prev,
        [key]: [item, ...(prev[key] as unknown[])] as DataState[K],
      }));
    },
    [],
  );

  const updateItem = useCallback(
    <K extends EntityKey>(
      key: K,
      id: string,
      patch: Partial<DataState[K][number]>,
    ) => {
      setData((prev) => ({
        ...prev,
        [key]: (prev[key] as { id: string }[]).map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ) as DataState[K],
      }));
    },
    [],
  );

  const deleteItem = useCallback(<K extends EntityKey>(key: K, id: string) => {
    setData((prev) => ({
      ...prev,
      [key]: (prev[key] as { id: string }[]).filter(
        (item) => item.id !== id,
      ) as DataState[K],
    }));
  }, []);

  const addNotification = useCallback(
    (message: string, type: "info" | "success" | "warning" = "info") => {
      setData((prev) => ({
        ...prev,
        notifications: [
          {
            id: makeId("notif"),
            message,
            type,
            date: new Date().toISOString().slice(0, 10),
            read: false,
          },
          ...prev.notifications,
        ],
      }));
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setData((prev) => ({ ...prev, notifications: [] }));
  }, []);

  const addDonation = useCallback(
    (donation: DataState["donations"][number]) => {
      addItem("donations", donation);
      addNotification(
        `New donation of ₹${donation.amount.toLocaleString("en-IN")} from ${donation.name}.`,
        "success",
      );
    },
    [addItem, addNotification],
  );

  const addContactSubmission = useCallback(
    (submission: DataState["contactSubmissions"][number]) => {
      addItem("contactSubmissions", submission);
      addNotification(`New contact message from ${submission.name}.`, "info");
    },
    [addItem, addNotification],
  );

  const addNewsletterSubscriber = useCallback(
    (subscriber: DataState["newsletterSubscribers"][number]) => {
      const exists = data.newsletterSubscribers.some(
        (s) => s.email.toLowerCase() === subscriber.email.toLowerCase(),
      );
      if (exists) return false;
      addItem("newsletterSubscribers", subscriber);
      return true;
    },
    [addItem, data.newsletterSubscribers],
  );

  const addVolunteerApplication = useCallback(
    (application: DataState["volunteerApplications"][number]) => {
      addItem("volunteerApplications", application);
      addNotification(
        `New volunteer application from ${application.name}.`,
        "info",
      );
    },
    [addItem, addNotification],
  );

  const addEventRegistration = useCallback(
    (registration: DataState["eventRegistrations"][number]) => {
      addItem("eventRegistrations", registration);
      addNotification(
        `New registration for an event from ${registration.name}.`,
        "info",
      );
    },
    [addItem, addNotification],
  );

  const addSession = useCallback((session: DataState["sessions"][number]) => {
    setData((prev) => ({ ...prev, sessions: [session, ...prev.sessions] }));
  }, []);

  const updateSession = useCallback(
    (id: string, patch: Partial<VisitorSessionPatch>) => {
      setData((prev) => ({
        ...prev,
        sessions: prev.sessions.map((s) =>
          s.id === id ? { ...s, ...patch } : s,
        ),
      }));
    },
    [],
  );

  const resetData = useCallback(() => {
    setData(seedData);
  }, []);

  const value = useMemo<DataContextValue>(
    () => ({
      data,
      addItem,
      updateItem,
      deleteItem,
      addNotification,
      markNotificationRead,
      clearNotifications,
      addDonation,
      addContactSubmission,
      addNewsletterSubscriber,
      addVolunteerApplication,
      addEventRegistration,
      addSession,
      updateSession,
      resetData,
    }),
    [
      data,
      addItem,
      updateItem,
      deleteItem,
      addNotification,
      markNotificationRead,
      clearNotifications,
      addDonation,
      addContactSubmission,
      addNewsletterSubscriber,
      addVolunteerApplication,
      addEventRegistration,
      addSession,
      updateSession,
      resetData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
