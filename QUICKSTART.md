# 📋 Step-by-Step: Deploy Your Project to CodeSandbox

## ⏱️ Time Required: ~10 minutes

---

## STEP 1: Commit Your Changes ✍️

Open PowerShell in your project folder and run:

```powershell
cd "c:\Users\PS\Desktop\power supply1\Power-Supply-Position-Feedback-Analytics-Platform"

# See all changed files
git status

# Add all changes
git add .

# Commit with message
git commit -m "Configure project for CodeSandbox deployment"

# Push to GitHub
git push origin main
```

**Wait for completion!** You should see:
```
✓ All changes committed
✓ 8 files created
✓ 4 files modified
✓ Pushed to GitHub
```

---

## STEP 2: Go to CodeSandbox 🌐

1. Open https://codesandbox.io in your browser
2. If not logged in, **Sign up with GitHub** (recommended)
3. Authorize CodeSandbox to access your GitHub

---

## STEP 3: Import Your Repository 📥

### Option A: Using CodeSandbox Dashboard
1. Click **"Create"** button (top left)
2. Select **"Import repository"**
3. Enter your GitHub URL:
   ```
   https://github.com/Shreya-3024/Power-Supply-Position-Feedback-Analytics-Platform
   ```
4. Click **"Import"**

### Option B: Direct URL
Simply visit:
```
https://codesandbox.io/p/github/Shreya-3024/Power-Supply-Position-Feedback-Analytics-Platform
```

---

## STEP 4: Wait for Build ⏳

**CodeSandbox will:**
- ✓ Download your repository
- ✓ Install dependencies (npm install)
- ✓ Build the project
- ✓ Start the backend server
- ✓ Start the frontend server

**This takes 2-5 minutes**

Watch for these logs in the terminal:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5001
✅ Frontend running on port 5173
```

---

## STEP 5: Find Your Live URL 🔗

Once build completes:

### In Browser Tab
You'll see a URL like:
```
https://kmx8f5hp-5173.csb.app
```

This is your **LIVE LINK**!

### Alternative Locations
1. **Top of editor** - Shows your sandbox URL
2. **Preview pane** (right side) - Shows your app running
3. **Browser URL bar** - Current CodeSandbox URL

---

## STEP 6: Test Your App ✅

### Test the Backend
Visit (replace with your URL):
```
https://kmx8f5hp-5001.csb.app/health
```

You should see:
```json
{
  "status": "success",
  "message": "PowerSupply API is running"
}
```

### Test the Frontend
The frontend port (5173) is your main app URL:
```
https://kmx8f5hp-5173.csb.app
```

You should see your Power Supply application running!

---

## STEP 7: Update Your GitHub README 📝

1. Go to GitHub: https://github.com/Shreya-3024/Power-Supply-Position-Feedback-Analytics-Platform
2. Edit **README.md** file
3. Add this section (replace the URL with yours):

```markdown
## 🚀 Live Demo

Experience the platform live on CodeSandbox:

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://kmx8f5hp-5173.csb.app)

**[Live Application](https://kmx8f5hp-5173.csb.app)**

*Note: Replace the URL with your actual CodeSandbox URL*
```

4. Commit and push the changes

---

## 🎯 Your Final Deliverables

### To Submit/Share:
```
✅ GitHub Repository Link:
https://github.com/Shreya-3024/Power-Supply-Position-Feedback-Analytics-Platform

✅ Live App Link:
https://kmx8f5hp-5173.csb.app  ← Replace with YOUR URL

✅ API Health Check:
https://kmx8f5hp-5001.csb.app/health  ← Replace with YOUR URL
```

---

## ⚠️ Troubleshooting

### Issue: "Something went wrong" error
**Solution:**
1. Check browser console (F12 → Console tab)
2. See error message
3. Refer to `DEPLOYMENT_GUIDE.md` in project root

### Issue: Backend not running
**Solution:**
1. Wait 30 seconds for full startup
2. Check CodeSandbox terminal for errors
3. Verify port 5001 shows "listening"

### Issue: Frontend can't connect to API
**Solution:**
1. Open browser DevTools (F12)
2. Check Network tab
3. Look for CORS errors
4. Backend might still be starting - wait and reload

### Issue: "Cannot find module"
**Solution:**
1. Delete `node_modules` folder in CodeSandbox
2. Wait for auto-reinstall
3. Or manually run: `npm install` in terminal

---

## 📚 Additional Resources

If you need help:
- **CodeSandbox Setup Guide:** See `CODESANDBOX_SETUP.md` in project root
- **Deployment Guide:** See `DEPLOYMENT_GUIDE.md` in project root
- **Project Summary:** See `SUMMARY.md` in project root

---

## ✨ Congratulations!

You now have:
- ✅ Your code on GitHub
- ✅ Your app running live on CodeSandbox
- ✅ A shareable link for your project
- ✅ Full-stack application accessible anywhere

**Share your live link with:**
- Course instructors
- Team members
- Portfolio
- GitHub profile
- Resume

---

## Quick Reference Checklist

```
[ ] Changes pushed to GitHub
[ ] CodeSandbox build complete (2-5 min)
[ ] Frontend loads without errors (port 5173)
[ ] Backend health check works (port 5001/health)
[ ] Live URL copied from browser
[ ] GitHub README updated with live link
[ ] Link tested in incognito/private browser
[ ] Ready to share!
```

---

**Total Time: ~15 minutes | Effort: Minimal | Results: HUGE!** 🚀
