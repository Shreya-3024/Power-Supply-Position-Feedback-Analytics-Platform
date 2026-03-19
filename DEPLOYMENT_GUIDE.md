# ✅ CodeSandbox Deployment Checklist & Guide

## Configuration Files Created ✓

- [x] `sandbox.config.json` - CodeSandbox configuration
- [x] `.env` - Backend environment variables (root)
- [x] `src/backend/.env` - Backend environment variables (backend)
- [x] `.env.example` - Environment variables template
- [x] `src/apiConfig.js` - Dynamic API URL configuration
- [x] `Procfile` - Deployment configuration
- [x] `CODESANDBOX_SETUP.md` - Detailed CodeSandbox guide

## Code Updates ✓

- [x] `src/backend/src/server.js` - Updated CORS for CodeSandbox, Fixed port to 5001
- [x] `src/backend/src/config/database.js` - Made MongoDB connection more resilient
- [x] `src/utils/api.js` - Dynamic API URL detection for CodeSandbox
- [x] `package.json` - Added proper npm scripts

## How to Deploy to CodeSandbox

### Step 1: Push Your Code to GitHub
```bash
git add .
git commit -m "Add CodeSandbox configuration"
git push origin main
```

### Step 2: Import to CodeSandbox
1. Go to https://codesandbox.io
2. Click "Import" or "Create" → "Import from GitHub"
3. Paste your GitHub repository URL:
   ```
   https://github.com/Shreya-3024/Power-Supply-Position-Feedback-Analytics-Platform
   ```
4. Click Import

### Step 3: Wait for Installation
- CodeSandbox will automatically install dependencies
- Backend will start on port 5001
- Frontend will start on port 5173
- CodeSandbox assigns you a public URL

### Step 4: Get Your Live Link
Once deployed:
- The live URL will appear in the browser tab
- Format: `https://{sandbox-id}.codesandbox.io`
- **Copy this URL** - this is your live link!

## Important: Environment Variables on CodeSandbox

For better stability, update the `.env` file in CodeSandbox:

1. Open CodeSandbox file explorer
2. Click on `.env` (root level)
3. Update `MONGODB_URI` if needed:
   ```
   MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/power-supply-feedback
   ```
4. Changes are auto-saved

## API Port Configuration

**Critical Fix Applied:**
- changed backend default port from 5000 → **5001** ✓
- Frontend now correctly connects to `http://localhost:5001/api` ✓
- CodeSandbox auto-detects port mapping ✓

## Database Connection

### Option 1: Local MongoDB (Not available on CodeSandbox)
```
MONGODB_URI=mongodb://mongodb:27017/power-supply-feedback
```

### Option 2: MongoDB Atlas (Recommended)
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update in `.env`:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/power-supply-feedback
   ```

## Testing Your Deployment

### Check Backend Health
Open in browser:
```
{your-live-url}/health
```

Should return:
```json
{
  "status": "success",
  "message": "PowerSupply API is running",
  "timestamp": "...",
  "environment": "development"
}
```

### Check API Endpoints
```
{your-live-url}/api
```

## Updating Your GitHub README

Add this to your `README.md`:

```markdown
## 🚀 Live Demo

Experience the platform live on CodeSandbox:

**[Live Application](https://your-sandbox-id.codesandbox.io)**

*Replace `your-sandbox-id` with your actual CodeSandbox ID*
```

## Local Testing (Before CodeSandbox)

Try running locally first:

```bash
# Terminal 1: Install and run backend
cd src/backend
npm install
npm start

# Terminal 2: Install and run frontend
npm install
npm run dev
```

Access at: http://localhost:5173

## Troubleshooting

### Backend Not Starting
- Check port 5001 is available
- Verify `.env` file exists with correct variables
- Check console logs for database connection errors

### Frontend Can't Connect to API
- Verify backend is running on port 5001
- Check browser console for CORS errors
- Ensure `.env` has correct API_URL

### Database Connection Failed
- Check MongoDB connection string
- Verify username/password are correct
- Allow access from CodeSandbox IP (MongoDB Atlas)

### Port Issues
- Don't manually change ports in server.js (already fixed to 5001)
- CodeSandbox handles port mapping automatically

## Next Steps

1. ✅ Push these changes to GitHub
2. ✅ Import repository into CodeSandbox
3. ✅ Wait for build and deployment
4. ✅ Copy your live URL from browser
5. ✅ Update README with live link
6. ✅ Share with others!

## Support & Resources

- CodeSandbox Docs: https://codesandbox.io/docs
- MongoDB Atlas: https://docs.mongodb.com/cloud/atlas
- Express.js: https://expressjs.com
- React: https://react.dev
- Vite: https://vitejs.dev

---

**Your project is now CodeSandbox-ready!** 🎉
