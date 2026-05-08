import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { BlobServiceClient } from "@azure/storage-blob";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup - stores file in memory before sending to Azure Blob
const upload = multer({
  storage: multer.memoryStorage(),
});

// Cosmos DB setup
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY,
});

const database = cosmosClient.database(process.env.COSMOS_DATABASE_ID);
const container = database.container(process.env.COSMOS_CONTAINER_ID);

// Azure Blob Storage setup - CORRECT VERSION
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const blobContainerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER_NAME
);

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "TripCloud Backend is running",
  });
});

// Upload photo route
app.post("/api/trips", upload.single("photo"), async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { title, description, tags, privacy, userEmail } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No photo uploaded",
      });
    }

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Create unique ID
    const id = uuidv4();

    // Create safe blob name
    const originalFileName = req.file.originalname.replace(/\s+/g, "-");
    const blobName = `${id}-${Date.now()}-${originalFileName}`;

    // Get blob client
    const blockBlobClient =
      blobContainerClient.getBlockBlobClient(blobName);

    console.log("Uploading file to Azure Blob Storage...");

    // Upload file buffer to Azure Blob Storage
    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: {
        blobContentType: req.file.mimetype,
      },
    });

    console.log("Azure Blob upload successful");
    console.log("File URL:", blockBlobClient.url);

    // Prepare item for Cosmos DB
    const newTrip = {
      id: id,
      title: title,
      description: description,
      tags: tags
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [],
      privacy: privacy || "Public",
      userEmail: userEmail || "guest@tripcloud.local",
      fileName: req.file.originalname,
      blobName: blobName,
      mediaUrl: blockBlobClient.url,
      mediaType: req.file.mimetype,
      contentType: req.file.mimetype,
      fileSize: req.file.size,
      createdAt: new Date().toISOString(),
    };

    console.log("Saving photo details to Cosmos DB...");

    const { resource } = await container.items.create(newTrip);

    console.log("Saved to Cosmos DB:", resource.id);

    res.status(201).json({
      success: true,
      message: "Photo uploaded successfully",
      trip: resource,
    });
  } catch (error) {
    console.error("Upload failed:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload photo",
      error: error.message,
    });
  }
});

// Update photo details by ID
app.put("/api/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {
          name: "@id",
          value: id,
        },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    const existingTrip = resources[0];
    const tags = req.body.tags;

    const updatedTrip = {
      ...existingTrip,
      title: req.body.title ?? existingTrip.title,
      description: req.body.description ?? existingTrip.description,
      privacy: req.body.privacy ?? existingTrip.privacy,
      tags:
        typeof tags === "string"
          ? tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : tags ?? existingTrip.tags,
      placeName: req.body.placeName ?? existingTrip.placeName,
      category: req.body.category ?? existingTrip.category,
      review: req.body.review ?? existingTrip.review,
      updatedAt: new Date().toISOString(),
    };

    const { resource } = await container.item(existingTrip.id, existingTrip.id).replace(updatedTrip);

    res.json({
      success: true,
      message: "Photo updated successfully",
      trip: resource,
    });
  } catch (error) {
    console.error("Failed to update photo:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update photo",
      error: error.message,
    });
  }
});

// Get all uploaded photos
app.get("/api/trips", async (req, res) => {
  try {
    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.createdAt DESC",
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    res.json({
      success: true,
      trips: resources,
    });
  } catch (error) {
    console.error("Failed to fetch trips:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips",
      error: error.message,
    });
  }
});

// Get one photo by ID
app.get("/api/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {
          name: "@id",
          value: id,
        },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    res.json({
      success: true,
      trip: resources[0],
    });
  } catch (error) {
    console.error("Failed to fetch photo:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch photo",
      error: error.message,
    });
  }
});

// Delete photo by ID
app.delete("/api/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {
          name: "@id",
          value: id,
        },
      ],
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Photo not found",
      });
    }

    const trip = resources[0];

    // Delete from Azure Blob Storage
    if (trip.blobName) {
      const blockBlobClient = blobContainerClient.getBlockBlobClient(
        trip.blobName
      );

      await blockBlobClient.deleteIfExists();
    }

    // Delete from Cosmos DB
    await container.item(trip.id, trip.id).delete();

    res.json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete photo:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete photo",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`TripCloud Backend running on http://localhost:${PORT}`);
});
