---
name: CampusMatch generated hook query options
description: Generated query hooks require queryKey even when passing only enabled/retry
---

**Rule:** When passing `{ query: { enabled: boolean, retry: false } }` to generated hooks like `useGetMe` or `useGetUserProfile`, you must also include `queryKey: [...]`. Without it TypeScript errors with "Property 'queryKey' is missing".

**Why:** The generated hook types extend `UseQueryOptions` which requires `queryKey` as a required field. The framework does provide a default but the type signature demands it explicitly when the options object is supplied.

**How to apply:** Always add a stable `queryKey` like `['auth/me', token]` or `['profile', userId]` when providing a `query` options object to generated hooks.
