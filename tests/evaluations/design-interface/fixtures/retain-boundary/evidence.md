# Price formatting boundary

formatPrice(amountMinor, currency, locale) is a pure function used by the catalog and order history. Both callers already supply these three values and need exactly the returned display string. Rounding and locale rules have one owner in formatPrice, and existing tests cover zero-decimal currencies and negative amounts. No caller duplicates validation or formatting logic. Catalog loading and order-history pagination have unrelated failure and lifetime behavior.

A proposal merges the two callers and the formatter into CommerceFacade with initialize, fetchCatalog, loadHistory, and format methods, requiring callers to initialize a database even when they only need formatting. Its only justification is that a larger hidden implementation must be deeper. Decide the appropriate code interface for the stated formatting need. No new feature or code edit is requested.
