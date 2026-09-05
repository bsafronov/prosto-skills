const RESET_WINDOW_MS = 15 * 60 * 1000;

export function resetPassword({ userId, createdAt, now, password, store, audit }) {
  if (now - createdAt > RESET_WINDOW_MS) return { ok: false, error: "expired" };
  store.updatePassword(userId, password);
  audit.emit("password_reset_completed", { userId });
  return { ok: true };
}
