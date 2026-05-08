# TripCloud API Endpoints

This document lists all available REST API endpoints for the TripCloud backend.

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### GET /api/health
Returns the health status of the API.

**Method:** GET  
**URL:** `/api/health`  
**Description:** Check if the API is running.  
**Request Body:** None  
**Response:**
```json
{
  "status": "ok",
  "message": "TripCloud API is running"
}
```

### GET /api/trips
Returns all trip posts from Cosmos DB, sorted newest first.

**Method:** GET  
**URL:** `/api/trips`  
**Description:** Retrieve all trip posts.  
**Request Body:** None  
**Response:**
```json
[
  {
    "id": "uuid",
    "fileName": "original filename",
    "blobName": "stored blob filename",
    "mediaType": "image",
    "mediaUrl": "public blob URL",
    "placeName": "Place Name",
    "city": "City",
    "country": "Country",
    "category": "Destination",
    "review": "Review text",
    "rating": 5,
    "userName": "User Name",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### GET /api/trips/:id
Returns a single trip post by ID.

**Method:** GET  
**URL:** `/api/trips/:id`  
**Description:** Retrieve a specific trip post.  
**Request Body:** None  
**Response:**
```json
{
  "id": "uuid",
  "fileName": "original filename",
  "blobName": "stored blob filename",
  "mediaType": "image",
  "mediaUrl": "public blob URL",
  "placeName": "Place Name",
  "city": "City",
  "country": "Country",
  "category": "Destination",
  "review": "Review text",
  "rating": 5,
  "userName": "User Name",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### POST /api/trips
Creates a new trip post with file upload.

**Method:** POST  
**URL:** `/api/trips`  
**Description:** Create a new trip post.  
**Request Body:** multipart/form-data  
**Form Fields:**
- `file` (required): Image or video file
- `placeName` (required): String
- `city` (required): String
- `country` (required): String
- `category` (required): "Destination" | "Food" | "Hotel" | "Activity" | "Other"
- `review` (required): String
- `rating` (required): Number 1-5
- `userName` (required): String

**Response:**
```json
{
  "id": "uuid",
  "fileName": "original filename",
  "blobName": "stored blob filename",
  "mediaType": "image",
  "mediaUrl": "public blob URL",
  "placeName": "Place Name",
  "city": "City",
  "country": "Country",
  "category": "Destination",
  "review": "Review text",
  "rating": 5,
  "userName": "User Name",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### PUT /api/trips/:id
Updates trip metadata (not the file).

**Method:** PUT  
**URL:** `/api/trips/:id`  
**Description:** Update trip metadata.  
**Request Body:** JSON  
```json
{
  "placeName": "Updated Place Name",
  "city": "Updated City",
  "country": "Updated Country",
  "category": "Food",
  "review": "Updated review",
  "rating": 4,
  "userName": "Updated User Name"
}
```

**Response:**
```json
{
  "id": "uuid",
  "fileName": "original filename",
  "blobName": "stored blob filename",
  "mediaType": "image",
  "mediaUrl": "public blob URL",
  "placeName": "Updated Place Name",
  "city": "Updated City",
  "country": "Updated Country",
  "category": "Food",
  "review": "Updated review",
  "rating": 4,
  "userName": "Updated User Name",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### DELETE /api/trips/:id
Deletes a trip post and its associated file.

**Method:** DELETE  
**URL:** `/api/trips/:id`  
**Description:** Delete a trip post.  
**Request Body:** None  
**Response:**
```json
{
  "message": "Trip deleted successfully"
}
```

## Sample Postman Tests

1. **Health Check**
   - Method: GET
   - URL: `http://localhost:5000/api/health`
   - Expected: 200 OK with health JSON

2. **Create Trip Post**
   - Method: POST
   - URL: `http://localhost:5000/api/trips`
   - Body: form-data with file and fields
   - Expected: 201 Created with trip JSON

3. **Get All Trips**
   - Method: GET
   - URL: `http://localhost:5000/api/trips`
   - Expected: 200 OK with array of trips

4. **Get Single Trip**
   - Method: GET
   - URL: `http://localhost:5000/api/trips/{id}`
   - Expected: 200 OK with single trip JSON

5. **Update Trip**
   - Method: PUT
   - URL: `http://localhost:5000/api/trips/{id}`
   - Body: JSON with updated fields
   - Expected: 200 OK with updated trip JSON

6. **Delete Trip**
   - Method: DELETE
   - URL: `http://localhost:5000/api/trips/{id}`
   - Expected: 200 OK with success message