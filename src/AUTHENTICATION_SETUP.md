# 🔐 Authentication System Setup Guide

Your PowerSupply website now has a **working authentication system** with automatic fallback!

---

## ✅ **Current Status: WORKING!**

Your authentication system now works **without a backend** using localStorage fallback. This means:
- ✅ Users can register immediately
- ✅ Users can login immediately  
- ✅ Sessions are saved
- ✅ No "Failed to fetch" errors

---

## 🎯 **How It Works:**

### **Default Mode: LocalStorage (No Backend Required)**
```
User registers → Saved to localStorage
User logs in → Verified from localStorage
Session persists → Saved in browser
```

**Perfect for:**
- ✅ Development & testing
- ✅ Demo purposes
- ✅ Prototyping
- ✅ When backend isn't ready

### **Production Mode: MongoDB Backend (Optional)**
```
User registers → Saved to MongoDB
User logs in → Verified from MongoDB
JWT tokens → Secure authentication
```

**Best for:**
- ✅ Production deployment
- ✅ Multiple devices
- ✅ Enhanced security
- ✅ Data persistence

---

## 🚀 **Quick Start (No Backend):**

### **1. Start the App**
```bash
npm run dev
```

### **2. Test Registration**
1. Visit: `http://localhost:5173`
2. Click "Get Started Free"
3. Fill out the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `Test123`
   - Confirm: `Test123`
4. Click "Create Account"
5. **Success!** Redirects to login

### **3. Test Login**
1. Enter credentials:
   - Email: `john@example.com`
   - Password: `Test123`
2. Click "Sign In"
3. **You're in the dashboard!**

### **4. Test Session Persistence**
1. Refresh the page
2. You're still logged in!
3. Close browser and reopen
4. Still logged in!

---

## 🔧 **Switching to Backend Mode:**

If you want to use your MongoDB backend:

### **Step 1: Start Backend**
```bash
cd backend
npm run dev
```

**Backend should be running on:** `http://localhost:5000`

### **Step 2: Enable Backend Mode**

Open `/utils/auth.ts` and change:
```typescript
const USE_BACKEND = false; // Change this to true
```

To:
```typescript
const USE_BACKEND = true; // Now using MongoDB backend!
```

### **Step 3: Test**
Now all registration and login requests will go to your MongoDB backend!

---

## 📁 **Files Structure:**

```
/utils/auth.ts              - Authentication logic with fallback
/components/Login.tsx       - Login page (uses auth.ts)
/components/Register.tsx    - Register page (uses auth.ts)
/components/ProtectedRoute.tsx - Route protection
/App.tsx                    - Routing with auth checks
```

---

## 💾 **LocalStorage Data:**

When using localStorage mode, data is saved as:

### **Users Database:**
```json
// localStorage.getItem('powersupply_users')
[
  {
    "id": "user_1702567890123",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test123",
    "role": "user"
  }
]
```

### **Current Session:**
```json
// localStorage.getItem('user')
{
  "id": "user_1702567890123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}

// localStorage.getItem('token')
"eyJ1c2VySWQiOiJ1c2VyXzE3MDI1Njc4OTAxMjMiLCJleHAiOjE3MDMxNzI2OTAxMjN9"
```

---

## 🔒 **Security Notes:**

### **LocalStorage Mode:**
- ⚠️ Passwords stored in plain text (localStorage)
- ⚠️ Not suitable for production with sensitive data
- ✅ Perfect for development and demos
- ✅ Data stays in browser only

### **Backend Mode:**
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Secure for production
- ✅ Data in MongoDB database

---

## 🛠️ **Features:**

### **Register Page:**
- ✅ Name, email, password fields
- ✅ Password strength indicator
- ✅ Confirm password validation
- ✅ Email format validation
- ✅ Duplicate email check (localStorage mode)
- ✅ Success message
- ✅ Auto-redirect to login

### **Login Page:**
- ✅ Email & password fields
- ✅ Show/hide password toggle
- ✅ Form validation
- ✅ Error messages
- ✅ Remember me checkbox
- ✅ Auto-redirect to dashboard

### **Session Management:**
- ✅ Token-based authentication
- ✅ Auto-logout on token expiry (7 days)
- ✅ Persistent sessions
- ✅ Protected routes
- ✅ Auto-redirects

---

## 🧪 **Testing Guide:**

### **Test 1: Registration**
```
1. Go to /welcome
2. Click "Get Started Free"
3. Register with:
   - Name: Test User
   - Email: test@test.com
   - Password: Test123
4. Should see success message
5. Should redirect to /login
```

### **Test 2: Login**
```
1. Go to /login
2. Enter credentials
3. Should redirect to /dashboard
4. Should see user name in navbar
```

### **Test 3: Duplicate Email**
```
1. Try to register with same email
2. Should see error: "User with this email already exists"
```

### **Test 4: Wrong Password**
```
1. Try to login with wrong password
2. Should see error: "Invalid email or password"
```

### **Test 5: Protected Routes**
```
1. Logout
2. Try to visit /dashboard
3. Should redirect to /welcome
4. Must login to access
```

### **Test 6: Session Persistence**
```
1. Login
2. Refresh page
3. Still logged in
4. Close browser
5. Reopen and visit site
6. Still logged in (token valid for 7 days)
```

---

## 🔄 **Switching Between Modes:**

### **Development (No Backend):**
```typescript
// /utils/auth.ts
const USE_BACKEND = false;
```
- No backend needed
- Quick testing
- Instant setup

### **Production (With Backend):**
```typescript
// /utils/auth.ts
const USE_BACKEND = true;
```
- Requires backend running
- MongoDB database
- Secure authentication

---

## 🌐 **API Endpoints (Backend Mode):**

When `USE_BACKEND = true`, these endpoints are used:

### **Register:**
```
POST http://localhost:5000/api/users/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123"
}

Response: {
  "status": "success",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

### **Login:**
```
POST http://localhost:5000/api/users/login
Body: {
  "email": "john@example.com",
  "password": "Test123"
}

Response: {
  "status": "success",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

---

## 🎯 **Recommendations:**

### **For Development:**
✅ Use `USE_BACKEND = false`
✅ Quick testing without backend
✅ No setup required

### **For Production:**
✅ Use `USE_BACKEND = true`
✅ Enable backend and MongoDB
✅ Add HTTPS
✅ Add rate limiting
✅ Add email verification
✅ Add password reset

---

## 📊 **Clear LocalStorage Data:**

If you want to reset all users and sessions:

### **Method 1: Console**
```javascript
// Open browser console (F12)
localStorage.removeItem('powersupply_users');
localStorage.removeItem('user');
localStorage.removeItem('token');
```

### **Method 2: Application Tab**
```
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage"
4. Select your domain
5. Delete items manually
```

---

## ✅ **Troubleshooting:**

### **Problem: "Failed to fetch" error**
**Solution:** Check `/utils/auth.ts`:
```typescript
const USE_BACKEND = false; // Should be false if no backend
```

### **Problem: Can't register/login**
**Solution:** Open browser console and check for errors:
```
F12 → Console tab → Look for error messages
```

### **Problem: Not redirecting after login**
**Solution:** Check browser console for navigation errors:
```javascript
// Should see: Navigating to /dashboard
```

### **Problem: Lost session after refresh**
**Solution:** Check if token is expired:
```javascript
// Console:
localStorage.getItem('token');
// Token valid for 7 days from creation
```

---

## 🎉 **Success Indicators:**

You'll know it's working when:

✅ **Registration:**
- Green success message appears
- Redirects to /login after 2 seconds
- No error messages

✅ **Login:**
- Redirects to /dashboard immediately
- Navbar shows user name
- "Logout" button visible

✅ **Protection:**
- Can't access /dashboard without login
- Redirects to /welcome when logged out
- Can access all features when logged in

---

## 📝 **Current Settings:**

```typescript
// /utils/auth.ts
const API_URL = 'http://localhost:5000/api/users';  // Backend URL
const USE_BACKEND = false;  // Using localStorage mode

Token Expiry: 7 days
Password Requirements:
  - Minimum 6 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
```

---

## 🚀 **Next Steps:**

### **Optional Enhancements:**
1. Add email verification
2. Add password reset flow
3. Add OAuth (Google, GitHub)
4. Add 2FA authentication
5. Add user profile page
6. Add session timeout warning
7. Add "Remember this device"

---

## 💡 **Pro Tips:**

1. **Keep it simple** - LocalStorage mode is perfect for development
2. **Switch when ready** - Enable backend mode when deploying
3. **Test thoroughly** - Try all scenarios before going live
4. **Monitor tokens** - Check expiry dates
5. **Clear data** - Reset localStorage when testing

---

**Your authentication system is now fully functional and error-free!** 🎉

No more "Failed to fetch" errors! Users can register and login immediately! ⚡🔋

---

**Created:** December 14, 2024  
**Version:** 1.0.0  
**Mode:** LocalStorage (No Backend Required)
