# API Endpoints

## Purpose

Define the first backend endpoints required to connect the `v2` site to the automated AI sourcing layer.

---

## Endpoint Overview

### `POST /api/requests`

Create a new sourcing request.

#### Request body
- must conform to `request-schema.json`

#### Response
```json
{
  "request_id": "req_20260320_0001",
  "status": "pending"
}
```

#### Responsibilities
- validate payload
- assign request id if not already assigned
- store raw request
- set status to `pending`
- enqueue or trigger the OpenAI sourcing workflow

---

### `GET /api/requests/:request_id`

Return request metadata and processing status.

#### Response
```json
{
  "request_id": "req_20260320_0001",
  "status": "processing",
  "submitted_at": "2026-03-20T14:30:00Z"
}
```

#### Status values
- `pending`
- `processing`
- `completed`
- `failed`

#### Responsibilities
- allow frontend polling
- give user-visible job state

---

### `GET /api/results/:request_id`

Return the final structured sourcing result.

#### Response
- must conform to `result-schema.json`

#### Responsibilities
- return final result payload for `v2/results.html`
- return `404` if the result is not yet available

---

### `POST /api/webhooks/openai`

Receive OpenAI webhook events when background responses finish.

#### Responsibilities
- verify webhook authenticity
- handle response completion events
- fetch or store final output
- update internal request status

---

## Suggested Lifecycle

1. Frontend submits request to `POST /api/requests`
2. Backend stores raw request and sets status `pending`
3. Backend starts the OpenAI sourcing workflow
4. Backend updates status to `processing`
5. OpenAI completes background task
6. Backend stores final result payload
7. Backend sets status to `completed`
8. Frontend fetches `GET /api/results/:request_id`

---

## Error Handling

### `POST /api/requests`
- `400` invalid payload
- `500` internal failure before job creation

### `GET /api/requests/:request_id`
- `404` request not found

### `GET /api/results/:request_id`
- `404` result not found or not ready
- `500` result processing failure

---

## Notes

The first implementation can use polling from the frontend.

Later improvements can include:
- websockets
- server-sent events
- user notifications
- scheduled re-checks
