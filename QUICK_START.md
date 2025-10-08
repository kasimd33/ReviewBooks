# 🚀 Quick Start Guide

## ✅ Migration Complete: Prisma → MongoDB

Your app now uses **MongoDB** instead of Prisma/PostgreSQL.

## Start Development

```bash
# 1. Start MongoDB (if not running)
mongod

# 2. Start the app
npm run dev

# 3. Open browser
http://localhost:3000
```

## Test Authentication

### Sign Up
- Go to: http://localhost:3000/auth/signup
- Create account with email/password
- Or click "Sign up with Google"

### Sign In
- Go to: http://localhost:3000/auth/signin
- Login with your credentials

## Environment Variables

Already configured in `.env`:
```
MONGODB_URL="mongodb://localhost:27017/ballotbridge"
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Deploy to Vercel

### 1. Get MongoDB Atlas (Free)
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string

### 2. Set Vercel Environment Variables
```
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/ballotbridge
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=T/zU3BhuKM8nUh8pl2+l6SglmH2CYFW+knVB36/S56s=
GOOGLE_CLIENT_ID=937185037873-bbvq4p9b1hirtq4pf071ejk6fkqltbli.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXT_PUBLIC_GOOGLE_ENABLED=true
```

### 3. Deploy
```bash
git add .
git commit -m "MongoDB migration"
git push
```

## What Changed

- ❌ Removed: Prisma, PostgreSQL
- ✅ Added: MongoDB native driver
- ✅ All features working: Auth, Books, Reviews

## Troubleshooting

**MongoDB not connecting?**
```bash
# Check if MongoDB is running
tasklist | findstr mongod

# Start MongoDB if not running
mongod
```

**Authentication error?**
- Clear browser cookies
- Try incognito mode

## Files Changed

- `src/lib/db.ts` - MongoDB connection
- `src/lib/auth.ts` - MongoDB auth
- `src/app/api/auth/register/route.ts` - MongoDB user creation
- `src/app/api/books/**` - MongoDB queries
- `src/app/api/reviews/**` - MongoDB queries
- `.env` - MongoDB URL
- `package.json` - Removed Prisma

## Documentation

- 📖 Full details: `MIGRATION_COMPLETE.md`
- 🔧 MongoDB setup: `MONGODB_SETUP.md`

---

**Ready to go!** Start with `npm run dev` 🎉
