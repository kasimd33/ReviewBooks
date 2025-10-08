# 🚀 Deployment Guide

## Step-by-Step Deployment to Vercel

### Step 1: Setup MongoDB Atlas (Free Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Try Free"
   - Sign up with Google or email

2. **Create a Cluster**
   - Choose "M0 Free" tier
   - Select a region close to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `bookreview`
   - Password: Generate a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `bookreview`
   
   Example:
   ```
   mongodb+srv://bookreview:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bookreview?retryWrites=true&w=majority
   ```

### Step 2: Prepare Your Code

1. **Update package.json for Vercel**
   
   Your build script should be:
   ```json
   "build": "next build"
   ```
   ✅ Already correct!

2. **Create vercel.json** (Optional - for custom config)
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next"
   }
   ```

### Step 3: Push to GitHub

1. **Initialize Git** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Book Review App"
   ```

2. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `book-review-app`
   - Make it Public or Private
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/book-review-app.git
   git branch -M main
   git push -u origin main
   ```

### Step 4: Deploy to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Click "Environment Variables" and add these:

   ```
   MONGODB_URL
   mongodb+srv://bookreview:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bookreview?retryWrites=true&w=majority

   NEXTAUTH_SECRET
   T/zU3BhuKM8nUh8pl2+l6SglmH2CYFW+knVB36/S56s=

   NEXTAUTH_URL
   https://your-app-name.vercel.app

   GOOGLE_CLIENT_ID
   937185037873-bbvq4p9b1hirtq4pf071ejk6fkqltbli.apps.googleusercontent.com

   GOOGLE_CLIENT_SECRET
   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

   NEXT_PUBLIC_GOOGLE_ENABLED
   true
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live!

### Step 5: Update Google OAuth

1. **Go to Google Cloud Console**
   - https://console.cloud.google.com/

2. **Update Authorized Redirect URIs**
   - APIs & Services → Credentials
   - Click your OAuth 2.0 Client ID
   - Add to "Authorized redirect URIs":
     ```
     https://your-app-name.vercel.app/api/auth/callback/google
     ```
   - Click "Save"

3. **Update NEXTAUTH_URL in Vercel**
   - Go to Vercel Dashboard
   - Your Project → Settings → Environment Variables
   - Edit `NEXTAUTH_URL` to your actual Vercel URL
   - Redeploy (Deployments → Click "..." → Redeploy)

### Step 6: Test Your Deployment

1. Visit your app: `https://your-app-name.vercel.app`
2. Test signup with email/password
3. Test Google OAuth login
4. Add a book
5. Write a review

## Quick Deploy Commands

```bash
# 1. Commit changes
git add .
git commit -m "Ready for deployment"

# 2. Push to GitHub
git push

# 3. Vercel auto-deploys!
```

## Troubleshooting

### "Internal Server Error" on Signup
- Check MongoDB Atlas connection string
- Verify database user has correct permissions
- Check IP whitelist includes 0.0.0.0/0

### Google OAuth Not Working
- Verify redirect URI in Google Console
- Check NEXTAUTH_URL matches your Vercel domain
- Ensure GOOGLE_CLIENT_ID and SECRET are correct

### Database Connection Failed
- Test connection string in MongoDB Compass
- Check password doesn't have special characters (URL encode if needed)
- Verify cluster is running in MongoDB Atlas

### Build Failed on Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## Environment Variables Checklist

- [ ] MONGODB_URL (from MongoDB Atlas)
- [ ] NEXTAUTH_SECRET (keep the same)
- [ ] NEXTAUTH_URL (your Vercel URL)
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] NEXT_PUBLIC_GOOGLE_ENABLED

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update NEXTAUTH_URL to your custom domain
5. Update Google OAuth redirect URI

## Monitoring

- **Vercel Analytics**: Automatic in dashboard
- **Error Logs**: Vercel Dashboard → Your Project → Logs
- **MongoDB Metrics**: MongoDB Atlas → Metrics tab

## Cost

- ✅ Vercel: Free (Hobby plan)
- ✅ MongoDB Atlas: Free (M0 tier)
- ✅ Total: $0/month

## Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Next.js Docs: https://nextjs.org/docs

---

🎉 **Your app is now live and accessible worldwide!**
