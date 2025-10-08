# ✅ Deployment Checklist

## Before Deployment

- [ ] App works locally (`npm run dev`)
- [ ] All features tested (signup, login, add book, review)
- [ ] No console errors
- [ ] MongoDB local connection working

## MongoDB Atlas Setup

- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user (username + password)
- [ ] Whitelist IP: 0.0.0.0/0
- [ ] Get connection string
- [ ] Replace `<password>` and `<dbname>` in connection string

## GitHub Setup

- [ ] Create GitHub repository
- [ ] Push code to GitHub
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin YOUR_REPO_URL
  git push -u origin main
  ```

## Vercel Deployment

- [ ] Create Vercel account (sign up with GitHub)
- [ ] Import project from GitHub
- [ ] Add environment variables:
  - [ ] MONGODB_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
  - [ ] GOOGLE_CLIENT_ID
  - [ ] GOOGLE_CLIENT_SECRET
  - [ ] NEXT_PUBLIC_GOOGLE_ENABLED
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete

## Google OAuth Update

- [ ] Go to Google Cloud Console
- [ ] Update Authorized Redirect URIs
- [ ] Add: `https://your-app.vercel.app/api/auth/callback/google`
- [ ] Save changes

## Final Steps

- [ ] Update NEXTAUTH_URL in Vercel to actual URL
- [ ] Redeploy from Vercel dashboard
- [ ] Test signup on live site
- [ ] Test Google OAuth on live site
- [ ] Test adding a book
- [ ] Test writing a review

## Post-Deployment

- [ ] Share your app URL! 🎉
- [ ] Monitor Vercel logs for errors
- [ ] Check MongoDB Atlas metrics

---

## Quick Commands

```bash
# Deploy updates
git add .
git commit -m "Update description"
git push
# Vercel auto-deploys!
```

## Your URLs

- **Local**: http://localhost:3000
- **Production**: https://your-app.vercel.app
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Vercel Dashboard**: https://vercel.com/dashboard

---

**Need help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions.
