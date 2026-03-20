# Job Lifecycle

## Purpose

Describe the lifecycle of a sourcing request from website submission to final AI-generated result.

---

## States

### `pending`
Request has been received and stored, but the sourcing workflow has not fully started.

### `processing`
The backend has initiated the OpenAI workflow and is waiting on tool execution, background completion, or result storage.

### `completed`
The final result payload has been stored and is ready for the frontend to retrieve.

### `failed`
The workflow could not complete successfully.

---

## Lifecycle Steps

### 1. Request submission
The user submits a sourcing request from `v2/request.html`.

Backend actions:
- validate payload
- store raw request
- assign request id
- set status to `pending`

### 2. Workflow creation
The backend creates an OpenAI Responses API job with the defined tools.

Backend actions:
- save OpenAI response id
- set status to `processing`

### 3. Request normalization
The model calls `normalize_part_request`.

Backend actions:
- execute normalization tool
- store normalized request

### 4. Candidate search
The model calls `search_public_sources`.

Backend actions:
- execute searches against approved sources
- return candidate URLs and snippets
- store raw candidate references if needed

### 5. Detail extraction
The model calls `extract_listing_details` for relevant URLs.

Backend actions:
- extract structured listing fields
- capture item metadata such as title, part number, supplier, condition, price, location, and image URL
- store candidate result records

### 6. Alternative search
If needed, the model calls `find_compatible_alternatives`.

Backend actions:
- return possible substitute part numbers or rebuild paths

### 7. Ranking
The model calls `rank_results`.

Backend actions:
- score candidate results
- order best match first
- annotate confidence

### 8. Final payload
The model returns the final structured result.

Backend actions:
- call `store_request_result`
- persist final result payload
- set status to `completed`

### 9. Frontend retrieval
The frontend requests `GET /api/results/:request_id`.

Frontend actions:
- load summary
- render ranked result cards
- render image if available
- render alternatives and disclaimer

---

## Failure Paths

### Validation failure
- request rejected before job creation
- status does not advance

### Tool failure
- source search fails
- extraction fails
- rank step fails
- backend may retry or mark failed

### OpenAI workflow failure
- model run fails
- background task errors
- status set to `failed`

---

## Retry Strategy

Recommended initial retry strategy:
- retry transient network failures
- retry individual source extraction failures a limited number of times
- do not retry invalid input payloads

---

## Visibility to Frontend

The frontend should always be able to retrieve a job state.

Recommended user-facing messages:
- `pending` → Request received
- `processing` → Sourcing in progress
- `completed` → Results ready
- `failed` → We could not complete this search

---

## Future Extensions

Later job lifecycle improvements can include:
- background re-checks for unresolved requests
- supplier alerts when matching inventory appears
- caching for repeated part requests
- user notifications when results update
