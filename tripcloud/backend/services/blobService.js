const { BlobServiceClient } = require("@azure/storage-blob");

function getBlobServiceClient() {
  const connectionString = (process.env.AZURE_STORAGE_CONNECTION_STRING || "").trim();

  if (!connectionString || connectionString.includes("YOUR_NEW_ROTATED_KEY_HERE")) {
    console.error("Azure Blob Storage configuration error: AZURE_STORAGE_CONNECTION_STRING is missing or still uses a placeholder value.");
    throw new Error("Azure Blob Storage is not configured. Please set AZURE_STORAGE_CONNECTION_STRING in .env");
  }

  if (!connectionString.includes("DefaultEndpointsProtocol=") || !connectionString.includes("AccountName=") || !connectionString.includes("AccountKey=")) {
    console.error("Azure Blob Storage configuration error: AZURE_STORAGE_CONNECTION_STRING must be the full Azure Storage connection string, not just the account key.");
    throw new Error("Azure Blob Storage connection string is invalid. Use the full connection string: DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net");
  }

  return BlobServiceClient.fromConnectionString(connectionString);
}

function getContainerClient() {
  const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

  if (!containerName) {
    console.error("Azure Blob Storage configuration error: AZURE_STORAGE_CONTAINER_NAME is missing from .env.");
    throw new Error("Azure Blob Storage container is not configured. Please set AZURE_STORAGE_CONTAINER_NAME in .env");
  }

  const blobServiceClient = getBlobServiceClient();
  return blobServiceClient.getContainerClient(containerName);
}

/**
 * Upload a file to Azure Blob Storage
 * @param {Buffer} fileBuffer - File buffer from multer memory storage
 * @param {string} blobName - Blob name to save in Azure
 * @param {string} contentType - Uploaded file MIME type
 * @returns {Promise<string>} Public blob URL
 */
async function uploadFileToBlob(fileBuffer, blobName, contentType) {
  try {
    const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const containerClient = getContainerClient();

    console.log("Uploading file to Azure Blob Storage:", {
      containerName,
      blobName,
      contentType,
      size: fileBuffer ? fileBuffer.length : 0
    });

    await containerClient.createIfNotExists({
      access: "blob"
    });

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: {
        blobContentType: contentType
      }
    });

    const mediaUrl = blockBlobClient.url;

    console.log("Azure Blob Storage upload complete:", {
      blobName,
      url: mediaUrl
    });

    return mediaUrl;
  } catch (error) {
    console.error("Azure Blob Storage upload failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      blobName
    });

    throw new Error(`Failed to upload file to Azure Blob Storage: ${error.message}`);
  }
}

/**
 * Delete a blob from Azure Blob Storage
 * @param {string} blobName
 */
async function deleteBlob(blobName) {
  try {
    if (!blobName) return;

    const containerClient = getContainerClient();
    const blobClient = containerClient.getBlockBlobClient(blobName);

    await blobClient.deleteIfExists();
  } catch (error) {
    console.error("Azure Blob Storage delete failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      blobName
    });

    throw new Error(`Failed to delete blob from Azure Blob Storage: ${error.message}`);
  }
}

module.exports = {
  uploadFileToBlob,
  deleteBlob
};
