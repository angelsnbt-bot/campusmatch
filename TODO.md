
# Registration Bug Fix Plan

## Issue
Registration fails with generic "Could not create account" error toast.

## Root Causes Identified
1. Poor frontend error handling - shows fallback message instead of actual error details
2. Empty string handling for optional DB fields (`phone`, `photoUrl`) 
3. Insufficient server-side error logging

## Steps
- [x] Step 1: Fix error handling in Register.tsx to show actual error details (HTTP status + message)
- [x] Step 2: Fix server auth route to normalize empty strings to null for nullable DB fields (phone, photoUrl)
- [x] Step 3: Add better server-side error logging and try-catch around DB inserts with user cleanup on profile failure

## ✅ All fixes applied successfully

