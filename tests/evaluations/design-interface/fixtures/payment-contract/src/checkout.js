export async function checkout(order, gateway, receipts, notify) {
  const prior = await receipts.get(order.requestId);
  if (prior) return { state: 'paid', receipt: prior };
  const receipt = await gateway.charge(order.requestId, order.amount);
  await receipts.putOnce(order.requestId, receipt);
  await notify(receipt);
  return { state: 'paid', receipt };
}
