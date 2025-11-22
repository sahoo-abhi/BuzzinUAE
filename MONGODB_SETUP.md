# BuzzinUAE with MongoDB Setup Guide

## Prerequisites

- Node.js installed
- MongoDB Atlas account (free tier available at https://www.mongodb.com/cloud/atlas)

## Step 1: Setup MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string (MONGODB_URI)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<username>` with your database username

## Step 2: Setup Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
# Add this to .env:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buzznews?retryWrites=true&w=majority
# PORT=5000

# Start the server
npm run dev
# Server will run on http://localhost:5000
```

## Step 3: Setup Frontend

```bash
# In the main directory (not server)

# Your .env.local is already set to:
# VITE_API_URL=http://localhost:5000/api

# Start the frontend dev server
npm run dev
# Frontend will run on http://localhost:5173
```

## Step 4: Testing Locally

1. Open http://localhost:5173 in your browser
2. Add some links
3. They will be stored in MongoDB
4. Open DevTools (F12) > Application > Local Storage to see your userId

## Step 5: Deploy to Vercel

### Backend Deployment (e.g., Railway, Render, Heroku, or Vercel)

For Vercel:

1. Push your `server` folder to GitHub separately or use a monorepo structure
2. Create a `vercel.json` in the server folder
3. Deploy the server and get the deployed URL

### Frontend Deployment

1. Update `.env.local` with your deployed backend URL:

```
VITE_API_URL=https://your-backend-url/api
```

2. Push to GitHub and deploy frontend to Vercel as usual

## Troubleshooting

- **API not connecting**: Check that both frontend and backend URLs are correct
- **MongoDB connection failed**: Verify your MONGODB_URI in .env
- **CORS errors**: The backend already has CORS enabled for all origins
- **Links not persisting**: Check MongoDB Atlas to see if data is being saved

## File Structure

```
Buzznews/
├── src/                    # Frontend (React)
├── server/                 # Backend (Express)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   ├── package.json
│   └── .env
├── .env.local             # Frontend env variables
└── vercel.json            # Frontend deployment config
```
