# 🚀 TESTING GUIDE - Admin Dashboard & Feedback Form

## ✅ SERVERS RUNNING

**Frontend**: http://localhost:3000/
**Backend**: http://localhost:5000/
**MongoDB**: Connected to `power_supply_feedback` database

---

## 📝 HOW TO TEST THE FEEDBACK FORM

### Step 1: Navigate to Feedback Form
1. Go to http://localhost:3000/
2. Login or Register (create a test account)
3. Click "Feedback" in the navbar or visit `/feedback`

### Step 2: Fill Out Section 1 - Basic Information
- **Case Selection**: Select a case (e.g., "Corsair 5000T")
- **PSU Model**: Select a PSU (e.g., "Corsair RM850x")
- **Placement**: Select placement (e.g., "bottom")
- **Fan Direction**: Will appear only if you selected "bottom" - choose a direction

### Step 3: Fill Out Section 2 - Performance
- **Temperature**: Click one of the 5 emoji buttons (🥶 to 🔥)
- **Noise Level**: Click one of the 5 emoji buttons (🔇 to 🔊)
- **Installation**: Click 1-5 stars (⭐)
- **Recommendation**: Check/uncheck the "Would you recommend?" box

### Step 4: Fill Out Section 3 - Extra Details (Optional)
- **Additional Notes**: Type some feedback
- **Photos**: Upload up to 3 images by clicking or dragging
- **Problems**: Select any applicable issues

### Step 5: Submit
- Click "Submit Feedback 🚀"
- See success toast notification
- Form resets automatically

---

## 👑 HOW TO TEST THE ADMIN DASHBOARD

### Step 1: Navigate to Admin Dashboard
1. Go to http://localhost:3000/
2. Make sure you're logged in
3. Click "Admin" in the navbar or visit `/admin/dashboard`

### Step 2: View Dashboard Statistics
- See cards showing:
  - Total Submissions
  - Pending count
  - Approved count
  - Rejected count

### Step 3: Use Filters & Search
- **Filter by Status**: Use dropdown to filter by status
- **Search**: Type to search by PSU model or case name
- **Bulk Select**: Check the header checkbox to select all rows

### Step 4: View Submission Details
1. Click "View" button on any submission
2. A modal will open with:
   - **Left side**: All the user's submission details
   - **Right side**: Admin tools
3. In the right panel:
   - Add admin notes
   - Select status
   - Click "Approve" or "Reject"
   - Click "Save Changes"

### Step 5: Bulk Approve
1. Select multiple submissions using checkboxes
2. Click "Approve Selected (X)" button
3. Toast shows success message

---

## 🔗 API ENDPOINTS TO TEST

### Test with curl or Postman:

**Create Feedback (Public)**
```bash
POST http://localhost:5000/api/feedback
Content-Type: application/json

{
  "case": "NZXT H7 Flow",
  "psuModel": "EVGA SuperNOVA 750G2",
  "placement": "bottom",
  "fanDirection": "up",
  "temperature": 3,
  "noiseLevel": 2,
  "installation": 4,
  "recommend": true,
  "notes": "Great PSU, runs cool",
  "problems": ["Connector looseness"]
}
```

**Get All Feedback (Protected)**
```bash
GET http://localhost:5000/api/feedback
Authorization: Bearer {token}
```

**Get Stats Overview (Protected)**
```bash
GET http://localhost:5000/api/feedback/stats/overview
Authorization: Bearer {token}
```

**Update Feedback Status (Protected)**
```bash
PATCH http://localhost:5000/api/feedback/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "adminNotes": "Verified - user provided good detail"
}
```

**Bulk Update (Protected)**
```bash
PATCH http://localhost:5000/api/feedback/bulk/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": ["id1", "id2", "id3"],
  "status": "approved"
}
```

---

## 📸 FILE UPLOAD TESTING

1. On the feedback form, click the upload area
2. Select up to 3 images (PNG, JPG, GIF, WebP)
3. Max 5MB per file
4. See previews with delete buttons
5. On submit, files are stored in `/uploads/feedback/`

---

## ✨ FEATURES TO VERIFY

### Feedback Form Features:
- ✅ Searchable dropdowns for case and PSU
- ✅ Conditional fan direction (only shows for bottom placement)
- ✅ 5-point rating scales with emojis
- ✅ Star rating system
- ✅ File upload with preview
- ✅ Multi-select problem checker
- ✅ Form validation
- ✅ Success/error toast notifications
- ✅ Responsive design

### Admin Dashboard Features:
- ✅ Real-time statistics
- ✅ Pagination support
- ✅ Filter by status
- ✅ Search functionality
- ✅ Row selection/bulk select
- ✅ Detail modal with full submission info
- ✅ Admin notes textarea
- ✅ Approve/Reject buttons
- ✅ Bulk approve action
- ✅ Status indicator badges
- ✅ Photo gallery display

---

## 🐛 DEBUGGING

### If form submission fails:
1. Check browser console for errors (F12)
2. Check backend logs for API errors
3. Ensure token is valid: `localStorage.getItem('token')`
4. Verify MongoDB is running: Check MongoDB connection message in backend logs

### If admin dashboard doesn't load:
1. Check if you're logged in
2. Check if you have valid authentication token
3. Try `/api/feedback` endpoint directly with curl
4. Check MongoDB connection in backend logs

### If file upload fails:
1. Check file size (max 5MB)
2. Check file type (only images allowed)
3. Check `/uploads/feedback` directory exists
4. Check backend disk space

---

## 📊 SAMPLE TEST DATA

### Test Case 1: Complete Feedback
```
Case: Corsair 5000T
PSU: Corsair RM850x
Placement: bottom
Fan Direction: up
Temperature: 3 (Same)
Noise: 2 (Quiet)
Installation: 4 stars
Recommend: Yes
Notes: "Excellent PSU, solid build quality"
Problems: []
Photos: 2 images
```

### Test Case 2: Problem Report
```
Case: NZXT H7 Flow
PSU: EVGA SuperNOVA 750G2
Placement: front
Temperature: 5 (Hotter)
Noise: 4 (Loud)
Installation: 2 stars
Recommend: No
Notes: "Fan started making noise after 6 months"
Problems: ["Fan noise", "Coil whine"]
Photos: 3 images
```

---

## 🎯 ACCEPTANCE CRITERIA

- ✅ Users can submit feedback with all fields
- ✅ Admins can view all submissions with pagination
- ✅ Admins can filter by status and search
- ✅ Admins can approve/reject individual submissions
- ✅ Admins can bulk approve multiple submissions
- ✅ Photos are stored and displayed correctly
- ✅ Timestamps are recorded
- ✅ Status changes are reflected in real-time
- ✅ Admin notes are saved with submissions
- ✅ All validations work (required fields, file sizes, etc.)

---

## 📱 RESPONSIVE TESTING

Test on different screen sizes:
- Desktop (1920px, 1366px)
- Tablet (768px)
- Mobile (375px)

Form and dashboard should adapt to all sizes.

---

**Status**: ✅ READY FOR TESTING
