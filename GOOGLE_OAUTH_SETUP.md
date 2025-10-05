# Google OAuth Setup Instructions

To enable Google authentication, you need to set up Google OAuth credentials:

## Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API

## Step 2: Create OAuth Credentials
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure OAuth consent screen first if prompted
4. Choose "Web application" as application type
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (for production)

## Step 3: Update Environment Variables
Replace the placeholder values in `.env` with your actual credentials:

```
GOOGLE_CLIENT_ID="your-actual-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-actual-client-secret"
```

## Step 4: Restart Development Server
```bash
npm run dev
```

## For Development/Testing
The current placeholder credentials will show an error but won't break the app.
Users can still sign in with email/password while you set up Google OAuth.