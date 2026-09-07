# RelayHub API contract
Owner: RelayHub API team. Effective 2026-08-12; cloud API 3.2.
Delivery is at least once: duplicate deliveries can occur.
With serial=true, deliveries preserve order within each stream. There is no order guarantee across streams.
Retries continue for 48 hours after the original attempt.
