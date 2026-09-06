Previous assistant: A retry key guarantees a payment is processed exactly once forever.
Evidence: The provider deduplicates the same key for 24 hours only. After expiry, the provider may process the request again. The first charge succeeded but its response was lost. A retry arrives after 25 hours.
User: I do not follow. Why can the same key still charge twice? Explain this example.
