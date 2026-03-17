# Setup Instructions for Sandbox/Production

## For Local Development

1. **Clone the repository**
```bash
git clone <repo-url>
cd Power-Supply-Position-Feedback-Analytics-Platform
```

2. **Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd src/backend
npm install
cd ../..
```

3. **Configure Environment Variables**
```bash
# Copy backend environment file
cp src/backend/.env.example src/backend/.env

# Copy frontend environment file (optional, only needed for production)
cp .env.example .env
```

4. **Setup MongoDB**
   - **Local:** Start MongoDB service on your machine
   - **Cloud:** Use MongoDB Atlas and update `MONGODB_URI` in `.env`

5. **Start the Application**
```bash
# Terminal 1: Start Backend
cd src/backend
npm start          # or npm run dev for development with nodemon

# Terminal 2: Start Frontend (from root directory)
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

---

## For Sandbox/Remote Deployment

### **Option 1: Deploy to Vercel (Frontend) + Railway/Render (Backend)**

**Frontend (Vercel):**
```bash
# Push to GitHub
git push origin main

# Deploy with Vercel CLI
npm install -g vercel
vercel
```

**Backend (Railway):**
```bash
1. Push to GitHub
2. Connect GitHub repo to Railway
3. Set environment variables in Railway dashboard
4. Deploy
```

**Update Frontend API URL:**
```bash
# In .env or .env.example
VITE_API_URL=https://your-production-backend-url.com/api
```

### **Option 2: Docker Deployment**

Create `Dockerfile` in root directory:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/build ./dist
COPY --from=builder /app/src/backend ./src/backend
COPY package*.json ./

WORKDIR /app/src/backend
RUN npm install --production

EXPOSE 5001
CMD ["npm", "start"]
```

### **Option 3: Manual Setup**

1. Update `.env` with MongoDB Atlas connection string
2. Update frontend config with production backend URL
3. Run `npm run build` on frontend
4. Deploy `dist` folder to static hosting (Netlify, GitHub Pages, etc.)
5. Deploy backend separately to a Node.js hosting (Heroku, Railway, etc.)

---

## Environment Variables

### Backend `.env`
```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/power_supply_feedback
JWT_SECRET=your_secret_key_here
FRONTEND_URL=https://your-frontend-url.com
NODE_ENV=production
```

### Frontend `.env` (Production)
```env
VITE_API_URL=https://your-backend-url.com/api
```

---

## Important Notes

- The frontend automatically detects the environment and uses the correct API URL
- In development: Uses `http://localhost:5001/api`
- In production: Uses the `VITE_API_URL` environment variable
- Backend `.env` should NOT be committed to Git (added to .gitignore)
- Always use strong JWT_SECRET in production

