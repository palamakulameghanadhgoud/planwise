# PlanWise Deployment Guide

## Deploying to Render.com

This guide walks you through deploying PlanWise to Render.com using the included `render.yaml` blueprint.

---

## Prerequisites

Before you begin, make sure you have:

1. ✅ GitHub account
2. ✅ Render.com account (sign up at https://render.com)
3. ✅ MongoDB Atlas account with a cluster (sign up at https://www.mongodb.com/atlas)
4. ✅ Google OAuth credentials (from Google Cloud Console)
5. ✅ Your code pushed to a GitHub repository

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Get Your Connection String

1. Log in to MongoDB Atlas
2. Go to your cluster → Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. **Important**: Replace `<password>` with your actual database password
6. URL encode special characters in the password (e.g., `@` becomes `%40`)

### 1.2 Whitelist Render's IP Addresses

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Note**: For production, you should whitelist only Render's specific IP ranges.

---

## Step 2: Update OAuth Redirect URIs

### 2.1 Google OAuth Setup

1. Go to Google Cloud Console (https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add these to **Authorized redirect URIs**:
   ```
   https://your-api-name.onrender.com/api/auth/google/callback
   ```
   (Replace `your-api-name` with your actual Render service name)
5. Save changes

### 2.2 GitHub OAuth Setup (Optional)

If using GitHub OAuth:
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Edit your OAuth App
3. Set "Authorization callback URL" to:
   ```
   https://your-api-name.onrender.com/api/auth/github/callback
   ```

---

## Step 3: Push to GitHub

1. Make sure all your code is committed:
   ```bash
   cd planwise
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. Ensure your repository is public or Render has access to it

---

## Step 4: Deploy to Render

### 4.1 Create New Blueprint

1. Log in to Render Dashboard (https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository containing PlanWise
5. Click "Connect"

Render will automatically detect the `render.yaml` file and create:
- ✅ Backend API service (`planwise-api`)
- ✅ Frontend static site (`planwise-frontend`)

### 4.2 Set Environment Variables for Backend

1. Go to your `planwise-api` service in Render
2. Click "Environment" in the left sidebar
3. Add these environment variables:

```bash
# Required
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
FRONTEND_URL=https://planwise-frontend.onrender.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://planwise-api.onrender.com/api/auth/google/callback

# Optional (if using GitHub OAuth)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://planwise-api.onrender.com/api/auth/github/callback
```

**Important**: Replace all placeholder values with your actual credentials!

4. Click "Save Changes"

### 4.3 Set Environment Variables for Frontend

1. Go to your `planwise-frontend` service in Render
2. Click "Environment" in the left sidebar
3. Add this environment variable:

```bash
VITE_API_URL=https://planwise-api.onrender.com
```

4. Click "Save Changes"

---

## Step 5: Update Frontend API Client

Make sure your frontend is configured to use the environment variable:

**File**: `planwise/frontend/src/api/client.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

This should already be set up correctly.

---

## Step 6: Deploy!

1. Both services will automatically deploy after you save environment variables
2. Wait for the build process to complete (5-10 minutes for first deploy)
3. Check the logs for any errors

### Monitor Deployment

**Backend Logs**:
- Go to `planwise-api` service
- Click "Logs" tab
- Look for: "Application startup complete"

**Frontend Logs**:
- Go to `planwise-frontend` service
- Click "Events" tab
- Look for: "Deploy live"

---

## Step 7: Update CORS Settings (if needed)

If you encounter CORS errors:

1. Edit `planwise/backend/app/main.py`
2. Update the CORS origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://planwise-frontend.onrender.com",  # Add your frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

3. Commit and push changes
4. Render will automatically redeploy

---

## Step 8: Test Your Deployment

1. Visit your frontend URL: `https://planwise-frontend.onrender.com`
2. Try to sign in with Google OAuth
3. Create a task
4. Check if data persists after refresh
5. Test all main features

---

## Troubleshooting

### Issue: "502 Bad Gateway" on API

**Solution**:
- Check if MongoDB Atlas IP whitelist includes Render's IPs
- Verify MongoDB connection string is correct
- Check backend logs for errors

### Issue: "OAuth redirect_uri_mismatch"

**Solution**:
- Make sure redirect URIs in Google Cloud Console match your Render API URL exactly
- Don't forget the `/api/auth/google/callback` path

### Issue: "Frontend can't connect to backend"

**Solution**:
- Verify `VITE_API_URL` is set correctly in frontend environment variables
- Check CORS settings in backend
- Make sure backend is deployed and running

### Issue: "Environment variable not found"

**Solution**:
- Double-check all environment variables are set in Render dashboard
- No quotes needed around values
- Redeploy after adding variables

### Issue: "Module not found" errors

**Solution**:
- Ensure `requirements.txt` (backend) and `package.json` (frontend) are up to date
- Check that rootDir is set correctly in `render.yaml`

---

## Free Tier Limitations

Render's free tier has some limitations:

⚠️ **Backend (Web Service)**:
- 750 hours/month free
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds

⚠️ **Frontend (Static Site)**:
- 100 GB bandwidth/month
- Always on (no spin-down)

💡 **Tip**: Consider upgrading to paid tier ($7/month per service) for production use to eliminate spin-down delays.

---

## Scaling for Production

### Database

- Use MongoDB Atlas M10+ cluster for better performance
- Enable backups
- Set up monitoring and alerts

### Backend

- Upgrade to paid Render plan ($7/month+)
- Consider using Render's Redis for caching
- Set up health check monitoring

### Frontend

- Use Render's CDN for faster global delivery
- Consider custom domain
- Enable HTTPS (automatic with Render)

### Security

1. **Environment Variables**: Never commit secrets to Git
2. **MongoDB**: Whitelist only Render's IP ranges (not 0.0.0.0/0)
3. **OAuth**: Use production credentials (not dev/test ones)
4. **CORS**: Restrict to only your frontend domain
5. **Secret Key**: Use a strong, unique secret key (Render can auto-generate)

---

## Custom Domain (Optional)

### Backend API

1. In Render dashboard, go to your API service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `api.planwise.app`)
4. Follow DNS configuration instructions
5. Update OAuth redirect URIs with new domain

### Frontend

1. In Render dashboard, go to your frontend service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `planwise.app`)
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` in backend environment variables

---

## Continuous Deployment

Render automatically redeploys when you push to your main branch:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
```

Render will:
1. Detect the push
2. Build both services
3. Deploy automatically
4. Show deployment status in dashboard

---

## Monitoring & Maintenance

### Health Checks

Backend health endpoint: `https://your-api.onrender.com/health`

Returns:
```json
{
  "status": "healthy"
}
```

### Logs

- Backend: Real-time logs in Render dashboard under "Logs" tab
- Frontend: Build logs and events in "Events" tab
- MongoDB: Query performance insights in Atlas dashboard

### Backup Strategy

1. **Database**: Enable automatic backups in MongoDB Atlas
2. **Code**: Keep Git repository up to date
3. **Environment Variables**: Document all variables securely

---

## Cost Estimate

### Free Tier (Good for Development/Demo)
- Backend: $0 (with spin-down)
- Frontend: $0
- MongoDB Atlas: $0 (M0 cluster)
- **Total**: $0/month

### Production Setup
- Backend: $7/month (no spin-down)
- Frontend: $0 (static sites are free)
- MongoDB Atlas: $9/month (M10 cluster)
- **Total**: ~$16/month

---

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review Render logs for error messages
3. Verify all environment variables are set correctly
4. Test locally first to isolate issues
5. Check Render status page: https://status.render.com

---

## Success! 🎉

Once deployed, your PlanWise app will be live at:
- **Frontend**: https://planwise-frontend.onrender.com
- **Backend API**: https://planwise-api.onrender.com
- **API Docs**: https://planwise-api.onrender.com/docs

Share it with users and start making student productivity better! 🚀

