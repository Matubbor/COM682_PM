# TripCloud Deployment Guide

This guide explains how to deploy TripCloud to Azure and set up the required resources.

## Prerequisites

- Azure subscription
- Node.js installed locally
- GitHub account (for CI/CD)
- Basic knowledge of Azure portal

## Azure Resources Setup

### 1. Azure Blob Storage

1. Go to Azure Portal > Storage Accounts
2. Create new storage account
3. Note the connection string from Access Keys
4. Create a container named `tripcloud-media`
5. Set public access level to "Blob" for media serving

### 2. Azure Cosmos DB

1. Go to Azure Portal > Cosmos DB
2. Create new Cosmos DB account (Core SQL API)
3. Create database: `TripCloudDB`
4. Create container: `Trips` with partition key `/id`
5. Note the endpoint URI and primary key

### 3. Azure App Service (Backend)

1. Go to Azure Portal > App Services
2. Create new Web App
3. Runtime stack: Node.js
4. Publish: Code
5. Configure environment variables in App Settings:
   - `PORT`: 8080 (or as needed)
   - `FRONTEND_URL`: Your frontend URL after deployment
   - `AZURE_STORAGE_CONNECTION_STRING`: From Blob Storage
   - `AZURE_STORAGE_CONTAINER_NAME`: tripcloud-media
   - `COSMOS_ENDPOINT`: From Cosmos DB
   - `COSMOS_KEY`: From Cosmos DB
   - `COSMOS_DATABASE_ID`: TripCloudDB
   - `COSMOS_CONTAINER_ID`: Trips

### 4. Azure Static Web Apps or App Service (Frontend)

Option 1: Azure Static Web Apps
1. Go to Azure Portal > Static Web Apps
2. Create new Static Web App
3. Source: GitHub
4. Build configuration:
   - Build command: (leave empty for static)
   - Output location: /
   - API location: (leave empty)

Option 2: Azure App Service
1. Create Web App with static hosting
2. Upload frontend files via FTP or Git

## Deployment Steps

### Backend Deployment

1. Push backend code to GitHub repository
2. In Azure App Service, configure deployment source:
   - Deployment Center > GitHub
   - Select repository and branch
3. Deploy automatically or manually

### Frontend Deployment

For Static Web Apps:
1. Push frontend code to GitHub
2. Connect to Static Web App in Azure
3. Deploy automatically

For App Service:
1. Upload files via FTP or deploy from Git

## CORS Configuration

In backend App Service, ensure CORS is configured:
- Allowed Origins: Add your frontend URL
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization

## Updating Frontend API URL

After backend deployment:
1. Update `frontend/js/config.js`:
   ```javascript
   const API_BASE_URL = "https://your-backend-app.azurewebsites.net";
   ```
2. Redeploy frontend

## GitHub/CI-CD Setup

1. Create GitHub repository for TripCloud
2. Push all code to repository
3. Configure Azure deployment pipelines:
   - Backend: App Service deployment
   - Frontend: Static Web Apps deployment
4. Enable automatic deployments on push to main branch

## Environment Variables

Backend requires these environment variables:
- `PORT=8080`
- `FRONTEND_URL=https://your-frontend.azurestaticapps.net`
- `AZURE_STORAGE_CONNECTION_STRING=<connection-string>`
- `AZURE_STORAGE_CONTAINER_NAME=tripcloud-media`
- `COSMOS_ENDPOINT=<cosmos-endpoint>`
- `COSMOS_KEY=<cosmos-key>`
- `COSMOS_DATABASE_ID=TripCloudDB`
- `COSMOS_CONTAINER_ID=Trips`

## Cost Management

- Monitor Azure resource usage
- Delete resources when not needed to avoid charges
- Use free tiers where available
- Set up alerts for budget limits

## Troubleshooting

- Check Azure App Service logs for backend errors
- Verify environment variables are set correctly
- Test CORS headers in browser developer tools
- Ensure Blob Storage container has public access
- Check Cosmos DB firewall settings