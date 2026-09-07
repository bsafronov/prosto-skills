The user asks: Explain why selecting Beta after Alpha sometimes leaves Alpha visible. Diagnose only; do not repair it.
Expected behavior: after both loads complete, the panel must show the most recently selected record.
S1: src/panel.js is the running implementation.
T1: select("Alpha") starts fetch A. Then select("Beta") starts fetch B. Both requests bypass the cache and the server returns the correct requested record.
T2: B completes with {id:"Beta"}; view.record becomes Beta. A then completes with {id:"Alpha"}; view.record becomes Alpha, while view.selectedId is Beta.
T3: In a controlled run with the same selected IDs, response bodies, and bypassed cache, A completes first and B last. Final view.record is Beta.
C1: The support note suspects a corrupt cache. No other cache mode has been exercised.
