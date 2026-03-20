# Backend Implementation Plan

## Goal

Build the first backend layer that connects the `v2` website to the automated AI sourcing workflow.

This backend should:
- accept sourcing requests from the website
- store request state
- call the OpenAI Responses API
- expose custom tools for the model
- store final sourcing results
- return those results to the frontend

---

## Recommended Stack

### Runtime
- Node.js

### Web framework
- Express or Fastify

### Database
- PostgreSQL or Supabase Postgres

### OpenAI integration
- OpenAI Responses API

### Background handling
- Start with database-backed polling
- Later add webhook completion handling

---

## Recommended Backend File Structure

```text
backend/
├── src/
│   ├── server.js
│   ├── app.js
│   ├── routes/
│   │   ├── requests.js
│   │   ├── results.js
│   │   └── webhooks.js
│   ├── controllers/
│   │   ├── createRequest.js
│   │   ├── getRequestStatus.js
│   │   ├── getRequestResult.js
│   │   └── openaiWebhook.js
│   ├── services/
│   │   ├── openaiClient.js
│   │   ├── sourcingWorkflow.js
│   │   ├── requestStore.js
│   │   └── resultStore.js
│   ├── tools/
│   │   ├── normalizePartRequest.js
│   │   ├── searchPublicSources.js
│   │   ├── extractListingDetails.js
│   │   ├── findCompatibleAlternatives.js
│   │   ├── rankResults.js
│   │   └── storeRequestResult.js
│   ├── db/
│   │   ├── schema.sql
│   │   └── client.js
│   └── utils/
│       ├── requestId.js
│       ├── logger.js
│       └── validation.js
├── package.json
├── .env.example
└── README.md
```

---

## First Endpoints to Build

### `POST /api/requests`
Creates a new sourcing request.

Responsibilities:
- validate request payload
- assign request id
- persist raw request
- trigger sourcing workflow
- return request id + initial status

### `GET /api/requests/:request_id`
Returns request status.

Responsibilities:
- return `pending`, `processing`, `completed`, or `failed`
- support frontend polling

### `GET /api/results/:request_id`
Returns final sourcing result.

Responsibilities:
- fetch stored result payload
- return `404` if not ready

### `POST /api/webhooks/openai`
Receives OpenAI webhook events.

Responsibilities:
- verify webhook authenticity
- handle completed background responses
- finalize storage

---

## Workflow Service

Create a `sourcingWorkflow.js` service responsible for:

1. receiving a request id and raw payload
2. creating the Responses API job
3. registering the available tools
4. tracking the OpenAI response id
5. storing progress

This service should be the main orchestration layer and keep route handlers thin.

---

## OpenAI Client Responsibilities

Create `openaiClient.js` to:
- create background responses
- retrieve response status
- handle tool-calling loop
- optionally support webhook-based completion later

---

## Tool Layer Responsibilities

Each tool should live in its own file and return structured data.

### `normalizePartRequest.js`
- canonicalize the user request
- derive category and search keywords

### `searchPublicSources.js`
- search approved public sources only
- return structured candidate source records

### `extractListingDetails.js`
- extract title, part number, price, condition, location, supplier, image URL, and notes

### `findCompatibleAlternatives.js`
- identify substitute part numbers or rebuild options

### `rankResults.js`
- score candidates by direct match, compatibility, condition, budget, and shipping suitability

### `storeRequestResult.js`
- persist final result payload in database

---

## Database Tables

### requests
- request_id
- submitted_at
- status
- customer_email
- raw_payload
- openai_response_id

### normalized_requests
- request_id
- canonical_part_name
- canonical_part_number
- category
- compatible_keywords
- confidence
- ambiguities

### candidate_results
- request_id
- source_name
- source_url
- title
- part_number
- supplier
- condition
- price
- location
- image_url
- extracted_payload
- score

### final_results
- request_id
- result_payload
- completed_at

---

## First Build Sequence

### Phase 1
- create backend project
- add request endpoint
- add database schema
- store raw requests

### Phase 2
- integrate Responses API
- create background job flow
- add polling by request id

### Phase 3
- implement tool functions
- return final result payload
- connect frontend results page to live backend

### Phase 4
- add webhook completion
- add retries and error tracking
- add file search/vector store support for catalogs and manuals

---

## Frontend Integration Target

After the backend exists:
- `v2/request.html` should submit to `POST /api/requests`
- frontend receives `request_id`
- frontend polls `GET /api/requests/:request_id`
- when completed, frontend loads `GET /api/results/:request_id`
- `v2/results.html` renders the live payload

---

## Notes

This plan is intentionally structured to get the product from static prototype to working AI-assisted sourcing service without forcing a full marketplace or heavy infrastructure too early.
