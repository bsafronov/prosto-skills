# Bounded Review

Use review to catch blocking defects, not to reopen implementation indefinitely.

1. Each task runs focused deterministic checks. Do not assign a separate reviewer to every low-risk task.
2. Each integration wave runs checks for the shared boundaries it changed.
3. After all required tasks integrate, run full repository checks and one strongest-available review against the approved contract and final diff.
   Record that pass with `workctl review --work <work.json> --result <review.json>`. The result contains `blockingFindings` and concise `evidence`; work cannot become `completed` before this gate.
4. Repair only blocking findings: unmet contract behavior, regressions, security or data risk, broken compatibility, or missing proof for changed behavior.
5. Recheck the repairs once, scoped to affected findings and checks. Run another full review only when a repair changed a critical shared boundary.

Stop after two reviewer passes. If a blocking finding remains, report the run as blocked and ask the user; do not continue a polishing loop. Record style, cleanup, and speculative improvements without expanding current scope.
