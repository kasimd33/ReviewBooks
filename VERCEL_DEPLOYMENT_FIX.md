# Vercel Deployment Fix Guide

## The Problem
Internal server error (500) when trying to signup/login on Vercel deployment.

## Root Causes Fixed
1. ✅ Multiple Prisma Client instances causing connection issues
2. ✅ Missing Google OAuth user creation callback
3. ✅ Incorrect environment variable configuration

## Files Updated
- `src/lib/auth.ts` - Fixed to use shared Prisma instance
- `src/app/api/auth/register/route.ts` - Fixed to use shared Prisma instance
- `src/lib/db.ts` - Already configured correctly

## Vercel Environment Variables Required

Go to your Vercel project → Settings → Environment Variables and add:

```
DATABASE_URL=postgres://97d012f0d95ac01d9d8598c769541e91e3e224810f3563dec771e48550678c69:sk_FVxMZiXqOzutkdKbMJbA5@db.prisma.io:5432/postgres?sslmode=require

NEXTAUTH_SECRET=T/zU3BhuKM8nUh8pl2+l6SglmH2CYFW+knVB36/S56s=

NEXTAUTH_URL=https://review-books-eta.vercel.app

GOOGLE_CLIENT_ID=937185037873-bbvq4p9b1hirtq4pf071ejk6fkqltbli.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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

NEXT_PUBLIC_GOOGLE_ENABLED=true
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Edit your OAuth 2.0 Client ID
5. Add these Authorized redirect URIs:
   - `https://review-books-eta.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local testing)

## Deployment Steps

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Fix authentication and database connection issues"
   git push
   ```

2. Vercel will automatically deploy

3. After deployment, test:
   - ✅ Signup with email/password
   - ✅ Login with email/password
   - ✅ Signup with Google
   - ✅ Login with Google

## Testing Locally

```bash
# Make sure .env has localhost URL
NEXTAUTH_URL="http://localhost:3000"

# Run dev server
npm run dev

# Test at http://localhost:3000
```

## Troubleshooting

If still getting errors:

1. Check Vercel logs: Project → Deployments → Click deployment → Runtime Logs
2. Verify all environment variables are set in Vercel
3. Make sure Google OAuth redirect URIs are correct
4. Ensure DATABASE_URL is accessible from Vercel

## What Was Fixed

### Before (❌ Broken)
- Multiple `new PrismaClient()` instances
- No Google OAuth user creation
- Missing signIn callback

### After (✅ Working)
- Single shared Prisma instance via `db` export
- Google OAuth creates users automatically
- Proper error handling and logging
