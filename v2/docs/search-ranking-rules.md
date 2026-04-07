# Search Ranking Rules

## Goal

Rank search results without AI using deterministic rules that are transparent, fast, and cheap.

---

## Recommended Scoring Model

### Exact match rules
- exact part number match: +100
- exact brand match: +25
- exact make/model match in listing text: +20
- exact category match: +10

### Preference rules
- preferred condition match: +10
- same region or favorable shipping region: +5

### Freshness and quality rules
- image present: +3
- price present: +2
- stale listing: -20
- removed listing: exclude entirely

---

## Ranking Order

1. direct part-number matches
2. strong title and brand matches
3. make/model related matches
4. category-neighbor results
5. stale but still visible fallback results only if nothing fresher exists

---

## Fallback Behavior

If no exact result exists:
- show near-matches by part number fragment
- show same brand + category results
- show make/model related results
- show request capture CTA

---

## Notes

This ruleset should stay simple for MVP. It is easier to debug, cheaper to operate, and good enough for an initial scraper-first marketplace search experience.
