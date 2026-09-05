export function resetPassword({ userId, password, store }) {
  store.updatePassword(userId, password);
  return { ok: true };
}
