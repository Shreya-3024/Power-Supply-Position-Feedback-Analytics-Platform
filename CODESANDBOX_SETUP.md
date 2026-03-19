# CodeSandbox Setup Instructions

## How to Run on CodeSandbox

1. **Import your GitHub repository** into CodeSandbox
   - Go to https://codesandbox.io
   - Click "Import repository"
   - Paste your GitHub URL

2. **Wait for installation** - CodeSandbox will automatically install dependencies

3. **The project will automatically start**:
   - Backend runs on port 5001
   - Frontend runs on port 5173
   - CodeSandbox provides a public URL

## Configuration Files

The following files have been added to support CodeSandbox:

### `sandbox.config.json`
- Configures CodeSandbox environment
- Sets Node version to 20
- Enables API container

### `.env` files
- Root `.env` file for backend configuration
- `src/backend/.env` file duplicated for backend setup

### `src/apiConfig.js`
- Provides dynamic API URL based on environment
- Handles both localhost and CodeSandbox URLs

### Updated `src/utils/api.js`
- Now uses dynamic BASE_URL
- Automatically detects CodeSandbox environment
- Falls back to localhost for local development

### Updated `src/backend/src/server.js`
- Enhanced CORS configuration
- Allows CodeSandbox domains
- Development mode support

## Important Notes

### Database
- Currently configured for `mongodb://mongodb:27017/power-supply-feedback`
- For production, update `MONGODB_URI` in `.env`:
  ```
  MONGODB_URI=your-mongodb-atlas-connection-string
  ```

### JWT Secret
- Change `JWT_SECRET` in `.env` for production:
  ```
  JWT_SECRET=your-secure-random-key
  ```

### Local Development
```bash
# Install all dependencies
npm run install-all

# Run backend (terminal 1)
npm run backend

# Run frontend (terminal 2)
npm run frontend
```

### CodeSandbox Web URL
Once deployed to CodeSandbox, your live URL will look like:
```
https://{sandbox-id}.codesandbox.io
```

Copy this URL and add it to your GitHub README.md

## Troubleshooting

### API Connection Issues
- Check browser console for errors
- Ensure backend port 5001 is accessible
- Verify CORS settings allow your domain

### Port Already in Use
- CodeSandbox handles port management automatically
- Port conflicts won't occur on CodeSandbox

### MongoDB Connection
- Update connection string if using MongoDB Atlas
- Test connection before deploying

## Support
For CodeSandbox support: https://codesandbox.io/docs/
For MongoDB support: https://docs.mongodb.com/
