---
name: CampusMatch auth token propagation
description: How the frontend wires auth tokens to all generated API hooks
---

**Rule:** Call `setAuthTokenGetter(() => localStorage.getItem('cm_token'))` in a `useEffect` inside `AuthProvider` (use-auth.tsx). This makes every generated hook in `@workspace/api-client-react` automatically send `Authorization: Bearer <token>` without manual header passing.

**Why:** The custom-fetch layer checks `_authTokenGetter` before every request. Without registering it, all authenticated API calls from generated hooks silently skip the Authorization header, causing 401s even when the user is logged in.

**How to apply:** If you add new auth-gated pages or hooks, no extra work needed — the getter is registered at app startup. Only manual fetch calls (e.g. `logout(...)`) need explicit headers passed in.
