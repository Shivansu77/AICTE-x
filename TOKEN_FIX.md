# JWT Token Expired - Quick Fix

## The Problem
You're getting 403 (Forbidden) errors because your JWT authentication token has expired or is invalid.

## Quick Solution

### Option 1: Log Out and Log Back In (Recommended)
1. Click on your profile/settings in the app
2. Click "Logout"
3. Log back in with your credentials
4. This will generate a fresh JWT token

### Option 2: Manual Token Refresh (If logout doesn't work)
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to the "Console" tab
3. Run this command:
   ```javascript
   localStorage.clear()
   ```
4. Refresh the page (F5)
5. You'll be redirected to login
6. Log back in with your credentials

### Option 3: Check Token in Console
To verify if your token exists:
```javascript
localStorage.getItem('token')
```

## Why This Happens
- JWT tokens have an expiration time
- After the token expires, the backend rejects requests with 403 error
- Logging in again generates a new valid token

## What Was Fixed
- ✅ Fixed User model import path in AuthMiddleware.js
- ✅ Fixed NaN error in credits input field
- ✅ Added better error logging

The authentication middleware is now working correctly - you just need a fresh token!
