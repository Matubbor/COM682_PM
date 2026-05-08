# TripCloud

TripCloud is a cloud-native travel media sharing platform where users can upload photos or videos from world tours, add location details, food/place reviews, ratings, and manage their trip posts through RESTful APIs.

## Features

- **Upload Trip Posts**: Share photos and videos with location details, reviews, and ratings
- **Browse Gallery**: View all trip posts in a responsive grid layout
- **Edit Posts**: Update trip metadata without re-uploading media
- **Delete Posts**: Remove posts and associated media files
- **RESTful API**: Full CRUD operations for trip management
- **Cloud Storage**: Azure Blob Storage for media files
- **NoSQL Database**: Azure Cosmos DB for metadata
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js + Express
- **File Upload**: Multer
- **Azure Services**: Blob Storage, Cosmos DB
- **Deployment**: Azure App Service

## Azure Services Used

- **Azure Blob Storage**: Media file storage
- **Azure Cosmos DB**: NoSQL database for trip metadata
- **Azure App Service**: Backend deployment
- **Azure Static Web Apps**: Frontend hosting (optional)

## Local Setup

### Prerequisites
- Node.js (v16 or higher)
- Azure subscription (for cloud features)

### Backend Setup
```bash
cd tripcloud/backend
npm install
cp .env.example .env
# Configure environment variables in .env
npm run dev
```

### Frontend Setup
```bash
cd tripcloud/frontend
# Open index.html in browser or use a local server
# For development, you can use:
npx serve .
```

### Environment Variables
Create `.env` file in backend directory:
```
PORT=5000
FRONTEND_URL=http://localhost:5500
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER_NAME=tripcloud-media
COSMOS_ENDPOINT=your_cosmos_endpoint
COSMOS_KEY=your_cosmos_key
COSMOS_DATABASE_ID=TripCloudDB
COSMOS_CONTAINER_ID=Trips
```

## Deployment

See [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for detailed Azure deployment instructions.

## API Documentation

See [API Endpoints](docs/API_ENDPOINTS.md) for complete API reference.

## Testing

See [Testing Summary](docs/TESTING_SUMMARY.md) for test cases and validation steps.

## Coursework Demo Checklist

- [ ] Functional frontend and backend
- [ ] Azure Blob Storage integration
- [ ] Azure Cosmos DB integration
- [ ] Full CRUD operations via REST APIs
- [ ] File upload handling
- [ ] Input validation
- [ ] Error handling
- [ ] CORS configuration
- [ ] Environment variable configuration
- [ ] Azure App Service deployment readiness
- [ ] Git/GitHub integration
- [ ] Clean, simple code structure
- [ ] Video presentation preparation

## Security Notes

- Never commit `.env` files with real secrets
- Use Azure App Service environment variables for production
- Monitor Azure resource usage to avoid unexpected costs
- Delete resources when not in use

## License

This project is for educational purposes as part of COM682 coursework.