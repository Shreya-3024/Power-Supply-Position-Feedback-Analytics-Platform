# 🎯 QUICK REFERENCE CARD

## 🚀 START HERE

### Access the System:
- **User Feedback Form**: http://localhost:3000/feedback
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Backend Health**: http://localhost:5000/health

### Login First:
- Go to http://localhost:3000/
- Register or login with your credentials
- Then access the form and dashboard

---

## 📝 USER FEEDBACK FORM

### Fill 3 Sections:
1. **Basic Info** - Select case, PSU, placement, fan direction
2. **Performance** - Rate temperature, noise, installation, recommendation
3. **Extra** - Add notes, upload photos, check problems

### Then Submit:
- Click "Submit Feedback 🚀"
- See success message
- Your feedback is saved!

---

## 👑 ADMIN DASHBOARD

### See Statistics:
- Total submissions
- Pending, approved, rejected counts
- Approval rate percentage

### Manage Submissions:
1. Search by PSU model or case
2. Filter by status (All/Pending/Approved/Rejected)
3. Click "View" on any submission
4. See all details, add notes, approve or reject
5. Use "Approve Selected" for bulk actions

---

## 🔗 API ENDPOINTS

```
PUBLIC:
POST /api/feedback - Submit feedback

PROTECTED (Requires Login):
GET /api/feedback - List submissions
GET /api/feedback/:id - Get details
PATCH /api/feedback/:id - Update status
PATCH /api/feedback/bulk/update - Bulk update
DELETE /api/feedback/:id - Delete (admin)
GET /api/feedback/stats/overview - Stats
```

---

## 📁 KEY FILES

**Frontend:**
- `FeedbackForm.jsx` - User form
- `AdminDashboard.jsx` - Admin interface
- `Navbar.jsx` - Navigation with links

**Backend:**
- `server.js` - Main server
- `feedbackRoutes.js` - API endpoints
- `.env` - Configuration

**Database:**
- MongoDB collection: `feedback`

---

## 🛠️ TROUBLESHOOTING

### Form won't submit?
- Check if logged in
- Verify all required fields filled
- Check browser console (F12)
- Check backend logs

### Dashboard not loading?
- Verify logged in
- Check MongoDB connection
- Try refreshing page
- Check network tab

### File upload failing?
- Check file size (max 5MB)
- Check file type (images only)
- Verify /uploads/feedback/ exists
- Check backend logs

---

## 🚀 SERVERS STATUS

| Service | Status | Port |
|---------|--------|------|
| Frontend (Vite) | ✅ Running | 3000 |
| Backend (Express) | ✅ Running | 5000 |
| MongoDB | ✅ Connected | 27017 |

---

## 📚 DOCUMENTATION

- `IMPLEMENTATION_SUMMARY.md` - Full features list
- `TESTING_GUIDE.md` - Step-by-step testing
- `DEPLOYMENT_COMPLETE.md` - Deployment info
- `PROJECT_SUMMARY.md` - Visual overview
- `FINAL_CHECKLIST.md` - 100% completion checklist

---

## ✨ FEATURES AT A GLANCE

**Form:**
- 3-section layout with validation
- Searchable dropdowns
- 5-point emoji rating scales
- Star rating (1-5)
- File upload with preview
- Multi-select problems

**Dashboard:**
- Real-time statistics
- Advanced search & filter
- Bulk operations
- Detail modal view
- Admin notes
- Approve/reject workflow

---

## 💡 TIPS

✅ Use Tab to navigate form fields
✅ Click dropdowns to search
✅ Drag photos to upload area
✅ Select "All Submissions" to see total list
✅ Use search to find specific PSU models
✅ Bulk select for quick approvals

---

## 🎯 COMMON WORKFLOWS

### Submit Feedback (5 min):
1. Click Feedback in navbar
2. Fill 3 sections
3. Upload photos (optional)
4. Click Submit
5. See confirmation

### Approve Feedback (2 min):
1. Open Admin Dashboard
2. Find submission in table
3. Click View
4. Add notes if needed
5. Click Approve
6. Click Save

### Bulk Approve (1 min):
1. Open Admin Dashboard
2. Select multiple rows
3. Click "Approve Selected"
4. Done!

---

## 🔐 SECURITY

- Login required for access
- JWT authentication tokens
- File type validation
- File size limits
- Input sanitization
- Rate limiting

---

## 📊 DATA PERSISTENCE

All data automatically saved to MongoDB:
- Feedback submissions
- Photos (in /uploads/feedback/)
- Admin notes
- Status changes
- Timestamps

---

## 🎉 YOU'RE ALL SET!

**Everything is ready to use:**
1. ✅ Frontend running
2. ✅ Backend running
3. ✅ Database connected
4. ✅ API working
5. ✅ File uploads configured

**Start now:**
- Submit feedback: http://localhost:3000/feedback
- Manage submissions: http://localhost:3000/admin/dashboard

---

**Version**: 1.0.0  
**Status**: ✅ READY  
**Last Updated**: December 21, 2025
