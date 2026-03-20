# OpenAI Responses API Flow

## Purpose

Define how the backend should use the OpenAI Responses API to orchestrate automated maritime parts sourcing.

---

## Why Responses API

Use the Responses API as the main reasoning and orchestration layer for:
- tool calling
- background processing
- later file search and web search integration

The model should not directly browse arbitrary sources on its own. Instead, it should decide which approved tools to call and the backend should execute those tools.

---

## High-Level Flow

1. Backend receives a new sourcing request
2. Backend stores the raw payload and assigns a request id
3. Backend creates a Responses API job
4. The model calls one or more tools
5. Backend executes tool calls and returns outputs
6. The model produces the final structured sourcing result
7. Backend stores the final result and marks the request as completed

---

## Suggested Request to OpenAI

The backend should send:
- system instructions
- the normalized request context if available
- the raw request payload
- the available tool definitions
- background mode enabled for long-running searches

### System behavior to enforce

The model should:
- normalize first
- prefer direct part-number matches
- clearly label alternatives vs direct matches
- explain uncertainty explicitly
- return structured output matching the result schema

---

## Tool Loop

The backend should expect the model to call zero, one, or multiple tools.

Recommended order:
1. `normalize_part_request`
2. `search_public_sources`
3. `extract_listing_details`
4. `find_compatible_alternatives` if needed
5. `rank_results`
6. `store_request_result`

The backend must:
- inspect tool calls
- execute the matching internal function
- return structured tool outputs back into the Responses API conversation

---

## Background Mode Pattern

Recommended lifecycle:

1. create response in background mode
2. store OpenAI response id alongside request id
3. poll by response id or process webhook completion
4. fetch final output
5. store result payload

This avoids tying frontend performance to long-running searches.

---

## Minimal Internal State to Store

For each request:
- request id
- current status
- OpenAI response id
- raw payload
- normalized request payload
- tool outputs if you want auditability
- final result payload

---

## Tool Output Expectations

Each tool should return structured JSON, not freeform text.

Examples:
- normalized request object
- array of candidate source records
- extracted listing detail object
- ranked result array

This makes downstream storage and rendering reliable.

---

## Future Extensions

Later, the same Responses API workflow can be expanded to include:
- file search against supplier catalogs and manuals
- cached result lookups
- user alerting and re-checks
- supplier-side matching notifications

---

## Practical Rule

The model should be the reasoning layer.

Your backend tools should be the action layer.

That separation keeps the system auditable, easier to debug, and safer to expand.
