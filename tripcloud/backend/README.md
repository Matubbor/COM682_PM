# TripCloud Backend

This is the backend service for the TripCloud application, built with Node.js, Express, and Azure services.

## Features

- RESTful API for managing trips
- File upload support for trip photos
- Azure Cosmos DB for data storage
- Azure Blob Storage for photo storage
- CORS enabled
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- Azure account with Cosmos DB and Blob Storage
- npm or yarn

## Setup

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd tripcloud/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Azure credentials:
     - `COSMOS_ENDPOINT`: Your Cosmos DB endpoint URL
     - `COSMOS_KEY`: Your Cosmos DB primary key
     - `COSMOS_DATABASE`: Database name (e.g., tripcloud-db)
     - `COSMOS_CONTAINER`: Container name (e.g., trips)
     - `BLOB_CONNECTION_STRING`: Your Blob Storage connection string
     - `BLOB_CONTAINER_NAME`: Container name for photos (e.g., trip-photos)

4. **Create the uploads directory (for temporary file storage):**
   ```bash
   mkdir uploads
   ```

## Running the Application

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on port 3000 by default, or the port specified in the `PORT` environment variable.

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get a specific trip by ID
- `POST /api/trips` - Create a new trip (multipart/form-data with name, description, photo)
- `PUT /api/trips/:id` - Update an existing trip
- `DELETE /api/trips/:id` - Delete a trip

## Trip Data Structure

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "photoUrl": "string (optional)",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string (optional)"
}
```

## Error Handling

The API returns appropriate HTTP status codes and JSON error messages:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## File Upload

Trip photos are uploaded as multipart/form-data. The photo field should contain the image file. Supported formats depend on Azure Blob Storage configuration.

## Azure Services Setup

### Cosmos DB
1. Create a Cosmos DB account
2. Create a database and container
3. Note the endpoint and primary key

### Blob Storage
1. Create a Storage Account
2. Create a container for photos
3. Get the connection string from Access Keys

## Development Notes

- Uses CommonJS require syntax
- UUIDs are generated for trip IDs
- Temporary uploaded files are cleaned up after blob upload
- CORS is enabled for frontend integration