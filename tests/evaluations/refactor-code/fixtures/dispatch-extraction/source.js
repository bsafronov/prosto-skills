function dispatchBatch(items, hooks) {
  const sent = [];
  for (const item of items) {
    if (!item.enabled) continue;
    hooks.audit(item.id);
    if (item.quantity <= 0) throw new RangeError("invalid quantity");
    sent.push(hooks.send(item));
  }
  return sent;
}
