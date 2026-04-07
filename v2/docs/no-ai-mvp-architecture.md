# No-AI MVP Architecture

## Goal

Build Marine Parts Locator as a financially safe MVP with no AI in the request path.

The MVP should:
- ingest listings from approved public sources
- normalize them into a shared schema
- store them in a database
- let users search the stored listings
- rank results with deterministic rules
- avoid per-request model costs entirely

---

## Core Principle

For the MVP:
- scraping does the ingestion
- database does the storage
- rules do the ranking
- website does the presentation

No AI is required.

---

## System Layers

### 1. Public Website

The `v2` website remains the public-facing interface.

Responsibilities:
- search UI
- listing results UI
- supplier intake UI
- request capture when no match exists

### 2. Crawler Layer

A separate crawler project ingests inventory from approved public sources.

Responsibilities:
- crawl source pages
- extract listing fields
- normalize output
- save records to database
- refresh listings on a schedule

### 3. Backend/API Layer

The backend serves data to the website.

Responsibilities:
- search listings from the database
- return listing details
- receive supplier intake submissions
- track freshness and stale listings

### 4. Database Layer

The database is the source of truth.

Responsibilities:
- store normalized listing records
- store supplier records
- store request captures
- store crawl timestamps and freshness metadata

---

## Search Flow

1. User searches for a part on the website
2. Backend queries the listings database
3. Deterministic ranking rules score matching records
4. Website renders ranked results
5. If no strong match exists, show related listings and request capture

---

## Ranking Without AI

Recommended scoring approach:
- exact part number match: +100
- exact brand match: +25
- make/model text match: +20
- category match: +10
- condition match: +10
- same region or preferred shipping region: +5
- stale listing penalty: -20

This keeps ranking predictable and cheap.

---

## Crawler Policy

Use the lightest crawler possible for each source.

### Default
Use HTTP/HTML crawling for sources that do not require JavaScript rendering.

### Escalation
Use browser-based crawling only for sources that require JavaScript to reveal content.

This keeps crawl time and infrastructure cost down.

---

## Refresh Policy

Each source should define:
- refresh interval
- source type
- extractor strategy
- listing freshness rules

Recommended starting rule:
- mark listings stale if not seen in 3 refresh cycles

---

## MVP Data Contracts

The MVP should center around:
- listing schema
- source registry
- search ranking rules
- backend read endpoints

---

## Recommended MVP Sequence

### Phase 1
- create crawler project
- define source registry
- define listing schema
- create first source adapters

### Phase 2
- store normalized listings
- expose search API
- replace sample site search data with backend data

### Phase 3
- add image support in results
- add staleness/freshness labels
- improve filtering and category pages

### Phase 4
- add paywall or premium access if desired
- only then consider whether any AI layer is justified

---

## Notes

This architecture is designed to protect the MVP from runaway usage costs. It prioritizes owned data, deterministic behavior, and low ongoing operational expense.
