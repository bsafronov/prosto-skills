# Checkout coordination

The browser checkout and the retry worker each coordinate lookup, payment, receipt persistence, and notification. They disagree about recovery after a timeout. Design the caller contract before changing code.

An order has a stable requestId created before its first payment attempt. The gateway charges at most once for the same requestId and amount; changing the key can charge again. A timeout does not prove failure: the provider may have charged. Gateway.lookup(requestId) resolves an ambiguous result when the provider is reachable.

ReceiptStore.putOnce(requestId, receipt) is durable and idempotent. Gateway payment and receipt storage are separate systems with no shared transaction. A successful charge can precede a failed receipt write. Notification is a separate best-effort effect; notification failure must not turn an already paid order into an unpaid order. No refunds, schema migration, queue platform, or new provider is in scope.

Use the existing terms requestId, receipt, paid, and pending. Callers need a receipt for paid orders and a recoverable pending response when the outcome cannot yet be established. Existing gateway integration tests validate provider idempotency; keep that evidence meaningful.
