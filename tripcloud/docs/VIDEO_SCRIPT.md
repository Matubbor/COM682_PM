# TripCloud 5-Minute Video Script

## Introduction (30 seconds)
"Hi everyone, today I'm presenting TripCloud, my COM682 Cloud Native Development coursework project. TripCloud is a cloud-native travel media sharing platform where users can upload photos and videos from their world tours, add location details, reviews, and ratings. The application is built for deployment on Microsoft Azure using services like Blob Storage and Cosmos DB."

## Problem and Solution (30 seconds)
"The challenge was to build a functional full-stack application with RESTful APIs, file uploads, and cloud storage. I chose Azure Blob Storage for media files and Azure Cosmos DB for metadata, with a Node.js Express backend and vanilla JavaScript frontend. This cloud-native approach ensures scalability and reliability."

## Frontend Demonstration (1 minute)
"Let me show you the frontend. This is the home page with a clean travel-themed design featuring a hero section and navigation. Users can upload trips, browse the gallery, or edit existing posts."

[Show index.html]

"The upload page has a form for creating new trip posts with fields for place name, location, category, rating, review, and media file upload."

[Show upload.html, fill form, submit]

## Gallery and CRUD Operations (1 minute 30 seconds)
"Here's the gallery showing all trip posts in a responsive grid. Each card displays the media, location details, rating, and review."

[Show gallery.html]

"To demonstrate CRUD operations, I'll upload a trip photo."

[Upload process]

"Now it's visible in the gallery. Let's edit this post to update the review."

[Click edit, show edit.html, update fields, submit]

"The metadata is updated. Now let's delete this post."

[Click delete, confirm]

"The post is removed from both the database and blob storage."

## Backend API Demo (1 minute)
"Now let's look at the backend. The Express server exposes RESTful APIs for all operations."

[Show server.js code briefly]

"I'll test the health endpoint and the trips API using Postman."

[Show Postman requests for GET /api/health, GET /api/trips, POST /api/trips, PUT, DELETE]

## Azure Resources (30 seconds)
"The application uses Azure Blob Storage for media files and Azure Cosmos DB for metadata. Here's the deployed App Service and the storage resources."

[Show Azure portal screenshots of App Service, Blob Storage container, Cosmos DB]

## Conclusion (30 seconds)
"In conclusion, TripCloud demonstrates full CRUD operations, file uploads, cloud storage integration, and RESTful API design. The code is simple, clean, and production-ready. Thank you for watching!"

## Total Time: 5 minutes

## Script Notes
- Speak clearly and at a moderate pace
- Use screen recording with cursor highlighting
- Include captions for accessibility
- Show actual working application, not just code
- Demonstrate both frontend and backend
- Keep technical explanations brief but clear
- End with contact information or Q&A