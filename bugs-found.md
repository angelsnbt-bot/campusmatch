# Bugs & Errors Found — CampusMatch Codebase Audit

## 🔴 CRITICAL (Fix Immediately)

### Bug 1: Marketplace sellerPhone always returns null
- **File:** `artifacts/api-server/src/routes/content.ts`
- **Line:** ~201
- **Code:** `sellerPhone: canSeeContact ? null : null`
- **Issue:** Both branches return `null`. When `canSeeContact` is `true` (verified user), it should return the seller's phone number to enable contact between verified students.

### Bug 2: Password reset doesn't clear refreshToken (auth bypass)
- **File:** `artifacts/api-server/src/routes/auth.ts` — reset-password handler
- **Code:** Only sets `jwtToken: null`, leaves `refreshToken` intact
- **Issue:** Old sessions can use `/auth/refresh` to get new access tokens after password change

### Bug 3: Off-by-one in isFirst100 approval logic
- **File:** `artifacts/api-server/src/routes/admin.ts` — approve handler
- **Issue:** Reads count of approved users BEFORE updating the user. If user is #100, count=99, they get isFirst100=true (should be false)

### Bug 4: Duplicate match rows can be created (no unique constraint)
- **File:** `artifacts/api-server/src/routes/discover.ts`
- **Issue:** `matchesTable` has no unique constraint on `(userId, matchedUserId)`, so `onConflictDoNothing` never fires. Duplicate matches accumulate.

### Bug 5: No rate limiting on OTP verification endpoints
- **File:** `artifacts/api-server/src/routes/auth.ts`
- **Route:** `/auth/verify-email`, `/auth/verify-forgot-otp`, `/auth/resend-otp`
- **Issue:** No rate limit middleware. In-memory OTP attempt tracker resets on server restart.

### Bug 6: allowBuilds misconfigured in pnpm-workspace.yaml
- **File:** `pnpm-workspace.yaml` (last line)
- **Code:** `esbuild: set this to true or false`
- **Issue:** Literal string instead of boolean `true`/`false`. Esbuild postinstall scripts won't execute.

## 🟡 MODERATE

### Bug 7: In-memory resetTokens Map never cleaned up (memory leak)
- **File:** `artifacts/api-server/src/routes/auth.ts`
- **Issue:** Expired reset tokens accumulate in memory with no cleanup

### Bug 8: Rate limit store cleanup is insufficient (memory leak)
- **File:** `artifacts/api-server/src/middlewares/rateLimit.ts`
- **Issue:** If no requests for `windowMs`, stale entries remain

### Bug 9: Logout doesn't handle refreshToken properly
- **File:** `artifacts/api-server/src/routes/auth.ts` — logout handler
- **Issue:** Sets jwtToken to null in SET but WHERE still uses jwtToken. Works in PG due to row-level update, but fragile.

### Bug 10: hashOtp uses static hardcoded salt
- **File:** `artifacts/api-server/src/routes/auth.ts`
- **Code:** `crypto.createHash("sha256").update(otp + "campusmatch_otp_salt")`
- **Issue:** Static salt provides minimal security value. Should use a configurable/hidden salt.

### Bug 11: Verification status check in discover route is missing
- **File:** `artifacts/api-server/src/routes/discover.ts`
- **Issue:** `GET /discover` only uses `requireAuth` but doesn't check if user is ERP-verified. Users can see profiles without being verified.

## 🟢 MINOR

### Bug 12: GetVerificationStatusResponse Zod schema missing "unverified" status
- **File:** `lib/api-zod/src/generated/api.ts`
- **Issue:** Schema uses enum `['pending', 'approved', 'rejected']` but the server returns `"unverified"` as a status

### Bug 13: price type mismatch — listings use integer but CreateListingBody uses number
- **File:** `lib/db/src/schema/content.ts` price is `integer("price")`, but Zod schema defines `price: zod.number()`
- **Issue:** Float prices get truncated silently when inserted into DB

### Bug 14: Navbar logout try-catch inconsistency
- **File:** `artifacts/campusmatch/src/components/layout/Navbar.tsx`
- **Issue:** Mobile menu `logoutUser()` call doesn't handle async errors

