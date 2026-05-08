# TripCloud Azure App Service Deployment

TripCloud is a Node/Express app that stores trip data in Azure Cosmos DB and uploads image/video files to Azure Blob Storage.

## Run Locally

From the backend folder:

```bash
cd tripcloud/backend
npm install
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

The backend runs on `http://localhost:3000` by default. The health check is:

```text
http://localhost:3000/api/health
```

If you open the plain frontend with Live Server, use `http://127.0.0.1:5500` or `http://localhost:5500`. The frontend will call the backend at `http://localhost:3000`.

## Required Environment Variables

Create `backend/.env` locally from `.env.example`. Do not commit real secrets.

```env
PORT=3000
FRONTEND_URL=http://127.0.0.1:5500

COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE_ID=tripcloud-db
COSMOS_CONTAINER_ID=trips

AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=youraccountkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=tripcloud-media
```

`AZURE_STORAGE_CONNECTION_STRING` must be the full Azure Storage connection string. Do not use only the account key.

## Blob Upload Requirements

The upload route expects the file field name to be `file`.

- Frontend: `formData.append("file", selectedFile)`
- Backend: `upload.single("file")`

Files are kept in memory by multer and uploaded to Azure Blob Storage with:

```js
blockBlobClient.uploadData(file.buffer, {
  blobHTTPHeaders: {
    blobContentType: file.mimetype
  }
});
```

The saved Cosmos DB trip document includes `mediaUrl`, which is the Azure Blob URL.

## Azure App Service Application Settings

In Azure Portal, open your App Service, then go to **Settings > Environment variables** or **Configuration > Application settings** and add:

```text
FRONTEND_URL=https://your-app-name.azurewebsites.net
COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
COSMOS_KEY=your-cosmos-key
COSMOS_DATABASE_ID=tripcloud-db
COSMOS_CONTAINER_ID=trips
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=youraccountkey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=tripcloud-media
```

Azure App Service supplies `PORT` automatically. You do not normally need to add `PORT` in App Service.

## Deploy to Azure App Service

Make sure the App Service uses a supported Node.js runtime. Deploy the backend app with its `package.json`, `server.js`, `routes`, and `services` folders.

The start script is:

```json
"start": "node server.js"
```

If deploying from the Azure CLI, one common flow is:

```bash
cd tripcloud/backend
npm install
az webapp up --runtime "NODE:20-lts" --name your-app-name --resource-group your-resource-group
```

After deployment, restart the App Service after adding or changing Application Settings.

## Test After Deployment

Use these URLs:

```text
https://your-app-name.azurewebsites.net/api/health
https://your-app-name.azurewebsites.net/upload.html
```

Submit the Upload Trip Post form with an image such as `hiking.jpeg`. Expected result:

- the file uploads to Azure Blob Storage
- the created trip document is saved in Cosmos DB
- the document contains the uploaded `mediaUrl`
- the page shows the upload success message

## Troubleshooting

If upload fails, check the App Service Log Stream. The backend logs safe diagnostic messages for:

- missing Cosmos DB variables
- Cosmos DB read/write failures
- missing Azure Blob Storage variables
- invalid Blob Storage connection string format
- multer file upload failures
- Azure Blob upload failures

The most common Blob error is using only the account key in `AZURE_STORAGE_CONNECTION_STRING`. Use the full value that starts with `DefaultEndpointsProtocol=https;`.
