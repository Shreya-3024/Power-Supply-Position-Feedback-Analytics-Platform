# ⚡ PowerSupply - Quick Start Guide

## 🚀 **Get Started in 30 Seconds:**

### **1. Start the App**
```bash
npm run dev
```

### **2. Open Browser**
```
http://localhost:5173
```

### **3. Sign Up (Choose One):**

**Option A: Email Sign-Up**
```
1. Click "Get Started Free"
2. Enter:
   - Name: Your Name
   - Email: your@email.com
   - Password: Test123
3. Click "Create Account"
4. Success! ✅
```

**Option B: Google Sign-Up**
```
1. Click "Get Started Free"
2. Click "Google" button
3. Instant access! ✅
```

### **4. You're In! 🎉**
- Dashboard access
- All features unlocked
- No errors!

---

## 📋 **Test Credentials:**

### **Quick Test Account:**
```
Email: test@test.com
Password: Test123
```

After first registration, use these to login!

---

## ✅ **What Works:**

- ✅ Registration (Email + Google)
- ✅ Login (Email + Google)
- ✅ Dashboard access
- ✅ Protected routes
- ✅ Session persistence
- ✅ Password strength meter
- ✅ Form validation
- ✅ No "Failed to fetch" errors!

---

## 🔧 **Troubleshooting:**

### **Can't see landing page?**
```bash
npm run dev
# Visit: http://localhost:5173
```

### **Want to reset everything?**
```javascript
// Browser Console (F12)
localStorage.clear();
location.reload();
```

### **Want to use backend?**
```typescript
// Open: /utils/auth.ts
const USE_BACKEND = true; // Change from false to true

// Then start backend:
cd backend
npm run dev
```

---

## 📁 **Key Files:**

- `/components/LandingPage.tsx` - First page
- `/components/Login.tsx` - Login page
- `/components/Register.tsx` - Sign up page
- `/components/Dashboard.tsx` - Main dashboard
- `/utils/auth.ts` - Authentication logic
- `/App.tsx` - Routing

---

## 🎯 **Current Mode:**

```
✅ LocalStorage Mode (No Backend Required)
   - Works immediately
   - No setup needed
   - Perfect for testing
   
💡 To enable backend:
   Open /utils/auth.ts
   Change: const USE_BACKEND = true;
```

---

## 🌟 **Features:**

### **Landing Page:**
- Hero section with animations
- Stats showcase
- Features display
- CTA buttons

### **Authentication:**
- Email/Password registration
- Google Sign-Up (demo)
- Email/Password login
- Google Sign-In (demo)
- Session management
- Token-based auth

### **Dashboard:**
- Real-time monitoring
- Power supply reviews
- Performance metrics
- All features accessible

---

## 📞 **Need Help?**

Check these files:
1. `/ERRORS_FIXED.md` - All fixes explained
2. `/AUTHENTICATION_SETUP.md` - Full auth guide
3. `/LANDING_PAGE_SETUP.md` - Landing page info

---

**Everything is ready to go! Just run `npm run dev` and start testing!** ⚡🔋

---

**Version:** 1.0.0  
**Status:** ✅ Ready to Use  
**Last Updated:** December 14, 2024
