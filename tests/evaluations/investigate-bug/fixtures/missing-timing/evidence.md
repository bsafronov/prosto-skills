The user asks: Explain why lookup requests spend about four seconds before returning, and identify the next observation if this cannot be established yet. Diagnosis only.
D1: Ten slow and ten normal requests had the same payload and destination; total duration was about 4 seconds versus 80 ms. All returned correct values.
D2: The only timestamps are handler entry and response completion. No queue-admission, DNS-start, DNS-end, or remote-request-start timestamp exists. No source code or runtime access is available.
H1: A saturated worker queue delays admission; DNS itself remains fast.
H2: Workers admit promptly; the DNS resolver delays resolution.
Both mechanisms predict the recorded total durations. A team member suggests adding a two-second retry timeout, but it has not been tried.
