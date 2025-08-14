# Date Journal Backend

This is the backend server for the Date Journal app, built with Node.js, Express, and MongoDB.

## Deployment to Render

### 1. Create a Render Account
- Go to [render.com](https://render.com) and sign up for a free account

### 2. Deploy from GitHub
1. Click "New +" and select "Web Service"
2. Connect your GitHub repository
3. Select the `server` directory from your repository
4. Configure the service:
   - **Name**: `date-journal-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Port**: `10000`

### 3. Environment Variables
Add these environment variables in Render:
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: `production`
- `PORT`: `10000`

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

### 5. Update Frontend
Once deployed, update your frontend `.env` file with:
```
VITE_API_URL=https://your-render-service-name.onrender.com
```

## Local Development

```bash
npm install
npm start
```

The server will run on port 5001 by default. 