export const SESSION_NOTICE_SECONDS = 60 * 60;
export const SESSION_WARNING_SECONDS = 30 * 60;
export const SESSION_DANGER_SECONDS = 10 * 60;
export type SessionAlertLevel = "notice" | "warning" | "danger";
export function getSessionAlertLevel(
  secondsLeft: number | null
): SessionAlertLevel | null {
  if (secondsLeft === null || secondsLeft <= 0) return null;

  if (secondsLeft <= SESSION_DANGER_SECONDS) return "danger";
  if (secondsLeft <= SESSION_WARNING_SECONDS) return "warning";
  if (secondsLeft <= SESSION_NOTICE_SECONDS) return "notice";

  return null;
}

export function formatSessionClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");

  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(secs)}`
    : `${pad(minutes)}:${pad(secs)}`;
}
