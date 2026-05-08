const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} = require("../services/cosmosService");

const {
  uploadFileToBlob,
  deleteBlob
} = require("../services/blobService");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: function (req, file, callback) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type. Please upload JPG, PNG, WEBP, MP4, or WEBM files only."));
    }
  }
});

function getMediaType(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  return "unknown";
}

function validateTripFields(body) {
  const title = body.title || body.placeName;
  const description = body.description || body.review;

  if (!title || String(title).trim() === "") {
    return "Title is required";
  }

  if (!description || String(description).trim() === "") {
    return "Description is required";
  }

  const rating = body.rating ? Number(body.rating) : 5;

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return "Rating must be a number between 1 and 5";
  }

  return null;
}

const uploadTripFile = upload.single("file");

function handleTripFileUpload(req, res, next) {
  uploadTripFile(req, res, function (error) {
    if (error) {
      console.error("Multer file upload failed:", {
        message: error.message,
        field: error.field,
        code: error.code
      });

      return res.status(400).json({
        error: error.message,
        message: error.message
      });
    }

    next();
  });
}

router.get("/", async (req, res) => {
  try {
    const trips = await getAllTrips();
    res.json(trips);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const trip = await getTripById(req.params.id);
    res.json(trip);
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;

    res.status(status).json({
      error: error.message
    });
  }
});

router.post("/", handleTripFileUpload, async (req, res) => {
  try {
    console.log("Upload route received request:", {
      hasFile: Boolean(req.file),
      fileField: req.file ? req.file.fieldname : null,
      originalName: req.file ? req.file.originalname : null,
      mimeType: req.file ? req.file.mimetype : null,
      size: req.file ? req.file.size : null,
      bodyFields: Object.keys(req.body)
    });

    const validationError = validateTripFields(req.body);

    if (validationError) {
      console.error("Trip upload validation failed:", validationError);

      return res.status(400).json({
        error: validationError,
        message: validationError
      });
    }

    if (!req.file) {
      console.error("Trip upload failed: no file received. Expected FormData field name: file");

      return res.status(400).json({
        error: "File is required",
        message: "File is required"
      });
    }

    const id = uuidv4();
    const safeOriginalName = req.file.originalname.replace(/\s+/g, "-");
    const blobName = `${id}-${safeOriginalName}`;

    let mediaUrl;

    try {
      mediaUrl = await uploadFileToBlob(req.file.buffer, blobName, req.file.mimetype);
    } catch (error) {
      console.error("Azure Blob upload failed:", error);
      throw error;
    }

    const now = new Date().toISOString();

    const title = req.body.title || req.body.placeName;
    const description = req.body.description || req.body.review;
    const tags = req.body.tags || "";
    const category = req.body.category || tags || "Other";
    const userName = req.body.userName || req.body.author || "PhotoCloud User";

    const trip = {
      id,
      fileName: req.file.originalname,
      originalFileName: req.file.originalname,
      blobName,
      mediaType: getMediaType(req.file.mimetype),
      mediaUrl,
      title,
      description,
      tags,
      privacy: req.body.privacy || "Public",
      author: userName,
      placeName: req.body.placeName || title,
      city: req.body.city || "",
      country: req.body.country || "Unknown",
      category,
      review: req.body.review || description,
      rating: Number(req.body.rating || 5),
      userName,
      createdAt: now,
      updatedAt: now
    };

    const createdTrip = await createTrip(trip);

    console.log("Trip upload saved successfully:", {
      id: createdTrip.id,
      blobName,
      mediaUrl
    });

    res.status(201).json({
      message: "Trip post created successfully",
      trip: createdTrip
    });
  } catch (error) {
    console.error("Upload failed:", error);
    console.error("Trip upload failed:", {
      message: error.message,
      stack: error.stack,
      file: req.file
        ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
          }
        : null,
      body: req.body
    });

    res.status(500).json({
      error: error.message,
      message: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const validationError = validateTripFields(req.body);

    if (validationError) {
      return res.status(400).json({
        error: validationError
      });
    }

    const title = req.body.title || req.body.placeName;
    const description = req.body.description || req.body.review;
    const tags = req.body.tags || "";
    const category = req.body.category || tags || "Other";
    const userName = req.body.userName || req.body.author || "PhotoCloud User";

    const updates = {
      title,
      description,
      tags,
      privacy: req.body.privacy || "Public",
      author: userName,
      placeName: req.body.placeName || title,
      city: req.body.city || "",
      country: req.body.country || "Unknown",
      category,
      review: req.body.review || description,
      rating: Number(req.body.rating || 5),
      userName
    };

    const updatedTrip = await updateTrip(req.params.id, updates);

    res.json({
      message: "Trip post updated successfully",
      trip: updatedTrip
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;

    res.status(status).json({
      error: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existingTrip = await getTripById(req.params.id);

    if (existingTrip.blobName) {
      try {
        await deleteBlob(existingTrip.blobName);
      } catch (error) {
        console.error("Azure Blob delete failed:", error);
      }
    }

    await deleteTrip(req.params.id);

    res.json({
      message: "Trip post deleted successfully"
    });
  } catch (error) {
    const status = error.message.includes("not found") ? 404 : 500;

    res.status(status).json({
      error: error.message
    });
  }
});

module.exports = router;
