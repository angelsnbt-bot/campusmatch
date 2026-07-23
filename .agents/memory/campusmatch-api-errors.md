---
name: CampusMatch API error access pattern
description: How to read server error messages from generated hook onError callbacks
---

**Rule:** In `onError: (err) => ...` callbacks from generated hooks, `err` is an `ApiError` (aka `ErrorType`). It has `.data` (the response body) and `.message` (HTTP status string), but no top-level `.error` field.

**Why:** The generated types come from `@workspace/api-zod` and wrap server responses in `ApiError<T>`. The server responds with `{ error: "..." }` JSON, which lands in `err.data.error`.

**How to apply:** Use `(err?.data as any)?.error || err?.message || 'Fallback message'` in toast error descriptions.
