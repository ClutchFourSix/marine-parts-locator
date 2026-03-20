# AI Sourcing Architecture

## Goal

Turn Marine Parts Locator into an automated maritime parts sourcing system.

The target workflow is:

1. User submits a part request from the website
2. Backend stores the raw request
3. Backend sends the request to the OpenAI Responses API
4. The model calls one or more tools
5. The backend executes those tools and returns results to the model
6. The model ranks and summarizes sourcing options
7. The backend stores the result and returns it to the website

This keeps the public website separate from the sourcing engine.

---

## Core Architecture

### 1. Front End

The public site is the request intake and results presentation layer.

Primary pages:
- `v2/request.html`
- `v2/search.html`
- `v2/pricing.html`
- future `v2/results.html`

Responsibilities:
- collect structured request data
- submit to backend endpoint
- poll or fetch result by request id
- render ranked sourcing results

### 2. Backend Orchestration Layer

The backend is the automation engine.

Responsibilities:
- receive request payloads
- validate and store input
- call the OpenAI Responses API
- expose tools/functions the model can call
- execute tool calls
- store and return structured result payloads

Suggested endpoint pattern:
- `POST /api/requests`
- `GET /api/requests/:request_id`
- `GET /api/results/:request_id`

### 3. OpenAI Layer

Use the OpenAI Responses API as the reasoning and tool orchestration layer.

The model should:
- normalize vague buyer requests
- decide which tools to call
- compare results
- rank options
- explain uncertainty clearly
- return structured output

### 4. Tool Layer

The model should have access to a controlled set of tools.

Initial tools:
- `normalize_part_request`
- `search_public_sources`
- `extract_listing_details`
- `find_compatible_alternatives`
- `rank_results`
- `store_request_result`

### 5. Data Layer

Store at least:
- raw request payloads
- normalized requests
- candidate results
- final ranked result payloads
- supplier records
- source metadata

Later additions:
- cached search results
- user history
- uploaded supplier catalogs
- cross-reference files

---

## Recommended Initial Flow

### Step 1 — Intake

The front end submits a request payload to:

`POST /api/requests`

The backend:
- validates input
- assigns a request id
- stores the raw request
- creates a sourcing job

### Step 2 — Normalize

The backend calls OpenAI with the raw request and exposes the available tools.

The model should call `normalize_part_request` first.

Goal:
- determine canonical part name
- canonicalize part number if possible
- identify category
- generate search keywords
- surface ambiguities

### Step 3 — Search

The model calls `search_public_sources` with one or more search queries.

Goal:
- find candidate public listings or supplier pages
- return URLs and basic metadata

### Step 4 — Extract

The model calls `extract_listing_details` for promising URLs.

Goal:
- turn messy pages into structured candidate objects
- capture price, condition, title, supplier, location, and notes

### Step 5 — Alternatives

If necessary, the model calls `find_compatible_alternatives`.

Goal:
- identify likely substitute part numbers
- surface rebuild or compatible options

### Step 6 — Rank

The model calls `rank_results`.

Goal:
- score candidate results by relevance
- prefer direct part-number matches
- consider condition, budget, and shipping region
- explicitly label uncertain alternatives

### Step 7 — Final Answer

The model returns a structured result payload using the agreed result schema.

The backend stores the output and returns it to the website.

---

## Tool Definitions

### normalize_part_request

Purpose:
- convert buyer input into canonical search terms and structured fields

Input:
- part name
- part number
- make
- model
- year
- notes

Output:
- canonical part name
- canonical part number
- category
- search keywords
- ambiguities
- confidence

### search_public_sources

Purpose:
- search approved public maritime parts sources

Input:
- list of search queries
- optional category
- optional condition preference
- optional destination region

Output:
- array of candidate source objects with title, url, snippet, source name

### extract_listing_details

Purpose:
- extract structured fields from a candidate supplier or listing page

Input:
- url

Output:
- title
- part number
- supplier
- condition
- price
- location
- description
- fit notes

### find_compatible_alternatives

Purpose:
- identify substitute part numbers or related options

Input:
- canonical part number
- manufacturer
- make
- model

Output:
- array of alternative part references with confidence notes

### rank_results

Purpose:
- score and sort candidate results

Input:
- normalized request
- candidate results

Output:
- ranked results with score and explanation

### store_request_result

Purpose:
- persist the final structured output for retrieval

Input:
- request id
- result payload

Output:
- success status and storage metadata

---

## Result Presentation

The website should present:
- a request summary
- the best match first
- clearly separated alternatives
- fit confidence labels
- uncertainty notes
- supplier/source links
- a fitment disclaimer

The result page should distinguish between:
- direct matches
- likely alternatives
- uncertain leads

---

## Automation Levels

### Level 1
AI normalizes the request and drafts a sourcing summary.

### Level 2
AI searches approved sources and returns candidate listings.

### Level 3
AI extracts structured details, ranks results, and identifies alternatives.

### Level 4
AI re-checks unresolved requests automatically and updates results.

Recommended target for launch:
- Level 2 moving into Level 3

---

## Practical Launch Plan

### Phase A
- website intake
- backend endpoint
- Responses API integration
- three initial tools:
  - normalize_part_request
  - search_public_sources
  - rank_results

### Phase B
- extraction tool
- result storage
- results page in `v2`
- supplier records

### Phase C
- file search with uploaded catalogs and manuals
- cross-reference retrieval
- alerting and re-checks

---

## Notes

GitHub Pages is suitable for the public front end and prototype navigation, but the sourcing engine itself must live in a backend environment that can:
- call the OpenAI API
- execute tools
- store results
- return structured responses to the website

This architecture keeps the product aligned with the long-term goal: AI-assisted sourcing rather than manual brokerage.
