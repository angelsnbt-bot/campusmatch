---
name: CampusMatch OTP removal
description: ERP-only verification flow and why OTP email verification was removed
---

CampusMatch no longer uses email OTP verification. Registration marks `emailVerified = true` immediately and redirects the user straight to the ERP verification page (`/verify`).

**Why:** The product requirement is to prevent fake/student-Gmail accounts. The only trusted identity token is the ERP enrollment number, so the OTP step was an unnecessary friction point and a potential loophole.

**How to apply:**
- Do not re-add OTP endpoints (`/auth/verify-email`, `/auth/resend-otp`) or an OTP UI page unless the product strategy explicitly changes.
- Any new auth gate should check `verificationStatus` (unverified/pending/approved/rejected), not `emailVerified`.
- Keep `/verification/status` returning `unverified` for users who have not submitted an ERP, so the frontend shows the submission form instead of "Under Review".
