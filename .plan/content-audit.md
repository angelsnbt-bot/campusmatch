# Content System Audit - Execution Plan

## Status: DB running, API running, all endpoints implemented
## Problem: Test script stale — expects "Cannot PATCH/DELETE" but code returns success

## Steps (execute sequentially)

### 1. Fix test script `/tmp/cm-content-test.sh`
- **Section 3 (POST EDIT/DELETE)**: Change expectations from "Cannot PATCH/DELETE" → verify success, persistence, ownership check, 404 after delete
- **Section 6 (MARKETPLACE)**: Fix unverified user check (check HTTP "403" not body), change listing edit/delete/sold from "Cannot" → verify success
- **Section 12 (EVENT EDIT/DELETE)**: Change expectations from "Cannot PATCH/DELETE" → verify admin-only success
- **Summary section**: Remove stale MISSING FEATURES list (all now implemented except comments/bookmarks)

### 2. Run test suite
```bash
bash /tmp/cm-content-test.sh
```

### 3. Fix any failures from test output

### 4. Verify frontend build
```bash
cd artifacts/campusmatch && pnpm build
```

### 5. Generate final audit report

## Key code already verified
- `content.ts:110-150` — Post PATCH + DELETE with ownership checks ✅
- `content.ts:219-255` — Event PATCH + DELETE (admin-only) ✅  
- `content.ts:340-393` — Marketplace PATCH, DELETE, PUT /sold ✅
- `content.ts:279-316` — Marketplace GET with pagination, search, status filter ✅
- Feed N+1 fix via batch profile + like queries ✅
- DB unique constraints on post_likes, event_rsvps ✅
