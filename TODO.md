# Bug Fix Plan — ✅ ALL FIXED

## 🔴 Critical Fixes
- [x] Bug 1: Marketplace sellerPhone always returns null → **FIXED**: Now fetches phone from usersTable, returns it for verified users
- [x] Bug 2: Password reset doesn't clear refreshToken → **FIXED**: Added `refreshToken: null, refreshTokenExpiresAt: null` to reset handler
- [x] Bug 3: ~~Off-by-one in isFirst100~~ → **NOT A BUG**: Logic is correct (99 < 100 = true for the 100th user)
- [x] Bug 4: Prevent duplicate match rows → **FIXED**: Added existence checks before inserting match records
- [x] Bug 5: Add rate limiting to OTP verification endpoints → **FIXED**: Added `authRateLimit` to `/verify-email` and `/resend-otp` routes
- [x] Bug 6: Fix allowBuilds in pnpm-workspace.yaml → **FIXED**: Changed `"set this to true or false"` → `true`

## 🟡 Moderate Fixes
- [x] Bug 7: Clean up expired resetTokens periodically → **FIXED**: Added `setInterval` cleanup every 15 minutes
- [x] Bug 8: Rate limit store cleanup improvement → **FIXED**: Added shared store with periodic cleanup every 5 minutes
- [x] Bug 9: Fix logout fragility (use user ID instead of jwtToken) → **FIXED**: Now looks up user by token first, then updates by ID
- [x] Bug 10: Use configurable salt for OTP hashing → **FIXED**: Now uses `process.env.OTP_SALT` with fallback
- [x] Bug 11: Add ERP-verification check to discover route → **FIXED**: Added check returning 403 if not approved

## 🟢 Minor Fixes
- [x] Bug 12: Fix GetVerificationStatusResponse Zod schema to include "unverified" → **FIXED**: Added to both `SubmitVerificationResponse` and `GetVerificationStatusResponse`
- [x] Bug 13: Price type consistency (integer rounding) → **FIXED**: Added `Math.round()` when inserting listings
- [x] Bug 14: Fix Navbar logout async handling → **FIXED**: Added `async/await` with `try/catch/finally`

