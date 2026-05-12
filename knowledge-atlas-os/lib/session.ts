export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function startSession() {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  if (!sessionStorage.getItem("ka_session_start")) {
    sessionStorage.setItem("ka_session_start", now);
  }

  const logs = JSON.parse(localStorage.getItem("ka_visit_logs") || "[]");
  const today = getTodayKey();
  const exists = logs.find((x: any) => x.date === today);

  if (!exists) {
    logs.unshift({
      date: today,
      firstVisit: now,
      lastVisit: now,
      durationSeconds: 0,
    });
  }

  localStorage.setItem("ka_visit_logs", JSON.stringify(logs));
}

export function updateSessionDuration() {
  if (typeof window === "undefined") return 0;

  const start = sessionStorage.getItem("ka_session_start");
  if (!start) return 0;

  const seconds = Math.floor((Date.now() - new Date(start).getTime()) / 1000);

  const logs = JSON.parse(localStorage.getItem("ka_visit_logs") || "[]");
  const today = getTodayKey();

  const next = logs.map((x: any) =>
    x.date === today
      ? {
          ...x,
          lastVisit: new Date().toISOString(),
          durationSeconds: seconds,
        }
      : x
  );

  localStorage.setItem("ka_visit_logs", JSON.stringify(next));
  return seconds;
}

export function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export function getVisitLogs() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("ka_visit_logs") || "[]");
}
