# Deployment Guide - Namma TapNGo

This guide will walk you through deploying the Namma TapNGo metro ticketing system to Render (backend) and Vercel (frontend).

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (for database)
- Render account (for backend)
- Vercel account (for frontend)

## Step 1: Backend Deployment (Render)

### 1.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### 1.2 Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `namma-tapngo-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if you prefer)

### 1.3 Set Environment Variables
In the Render dashboard, go to Environment and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/namma-tapngo
JWT_SECRET=your-super-secret-jwt-key-here
QR_SECRET=your-qr-token-secret-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

**Note**: Replace the MongoDB URI with your actual MongoDB Atlas connection string.

### 1.4 Deploy
Click "Create Web Service" and wait for deployment to complete. Note down the service URL (e.g., `https://namma-tapngo-backend.onrender.com`).

## Step 2: Frontend Deployment (Vercel)

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your GitHub repository

### 2.2 Configure Project
1. Select "Import Project"
2. Choose your repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 2.3 Set Environment Variables
In the Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_API_URL=https://your-backend.onrender.com/api
```

**Note**: Replace with your actual Render backend URL.

### 2.4 Deploy
Click "Deploy" and wait for deployment to complete. Note down the frontend URL (e.g., `https://namma-tapngo.vercel.app`).

## Step 3: Update Backend CORS

After getting your Vercel frontend URL, update the `FRONTEND_URL` environment variable in Render with your actual Vercel URL.

## Step 4: Database Setup

### 4.1 MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for development
5. Get your connection string

### 4.2 Seed Database
After deployment, you can seed the database by:
1. Making a POST request to your backend's seed endpoint, or
2. Running the seed script locally with the production database URL

## Step 5: Testing

1. Visit your Vercel frontend URL
2. Register a new account
3. Test the QR code generation
4. Test the gate simulator functionality
5. Verify wallet operations
6. Check trip history

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly
2. **Database Connection**: Verify MongoDB URI is correct and IP whitelist includes all addresses
3. **Environment Variables**: Double-check all environment variables are set correctly
4. **Build Failures**: Check build logs in both Render and Vercel dashboards

### Logs and Debugging

- **Render**: Check service logs in the Render dashboard
- **Vercel**: Check function logs in the Vercel dashboard
- **MongoDB**: Check connection logs in MongoDB Atlas

## Production Considerations

1. **Security**: Use strong JWT secrets and secure MongoDB credentials
2. **Performance**: Consider upgrading to paid plans for better performance
3. **Monitoring**: Set up monitoring and alerting for your services
4. **Backup**: Regular database backups
5. **SSL**: Both Render and Vercel provide SSL certificates automatically

## Environment Variables Summary

### Backend (Render)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/namma-tapngo
JWT_SECRET=your-super-secret-jwt-key-here
QR_SECRET=your-qr-token-secret-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

## URLs After Deployment

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **API Base**: `https://your-backend.onrender.com/api`

Your Namma TapNGo metro ticketing system should now be live and accessible to users worldwide!
