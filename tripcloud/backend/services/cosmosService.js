const { CosmosClient } = require("@azure/cosmos");

let container = null;

function getContainer() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;
  const databaseId = process.env.COSMOS_DATABASE_ID;
  const containerId = process.env.COSMOS_CONTAINER_ID;

  if (!endpoint || endpoint.includes("your-cosmos-account")) {
    console.error("Cosmos DB configuration error: COSMOS_ENDPOINT is missing or still uses a placeholder value.");
    throw new Error("Cosmos DB is not configured. Please set COSMOS_ENDPOINT in .env");
  }

  if (!key || key.includes("your-cosmos-key")) {
    console.error("Cosmos DB configuration error: COSMOS_KEY is missing or still uses a placeholder value.");
    throw new Error("Cosmos DB is not configured. Please set COSMOS_KEY in .env");
  }

  if (!databaseId || !containerId) {
    console.error("Cosmos DB configuration error: COSMOS_DATABASE_ID or COSMOS_CONTAINER_ID is missing.");
    throw new Error("Cosmos DB database/container names are missing in .env");
  }

  if (!container) {
    const client = new CosmosClient({
      endpoint,
      key
    });

    const database = client.database(databaseId);
    container = database.container(containerId);
  }

  return container;
}

async function getAllTrips() {
  try {
    const tripContainer = getContainer();

    const querySpec = {
      query: "SELECT * FROM c ORDER BY c.createdAt DESC"
    };

    const { resources } = await tripContainer.items.query(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error("Cosmos operation failed:", error);
    console.error("Cosmos DB get all trips failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });

    throw new Error(`Failed to get all trips: ${error.message}`);
  }
}

async function getTripById(id) {
  try {
    const tripContainer = getContainer();

    const querySpec = {
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [
        {
          name: "@id",
          value: id
        }
      ]
    };

    const { resources } = await tripContainer.items.query(querySpec).fetchAll();

    if (!resources || resources.length === 0) {
      throw new Error("Trip not found");
    }

    return resources[0];
  } catch (error) {
    console.error("Cosmos operation failed:", error);
    console.error("Cosmos DB get trip by ID failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      tripId: id
    });

    throw new Error(`Failed to get trip by ID: ${error.message}`);
  }
}

async function createTrip(trip) {
  try {
    const tripContainer = getContainer();
    const { resource } = await tripContainer.items.create(trip);
    return resource;
  } catch (error) {
    console.error("Cosmos operation failed:", error);
    console.error("Cosmos DB create trip failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      tripId: trip ? trip.id : null,
      mediaUrl: trip ? trip.mediaUrl : null,
      blobName: trip ? trip.blobName : null
    });

    throw new Error(`Failed to create trip: ${error.message}`);
  }
}

async function updateTrip(id, updates) {
  try {
    const tripContainer = getContainer();

    const existingTrip = await getTripById(id);

    const updatedTrip = {
      ...existingTrip,
      ...updates,
      id,
      updatedAt: new Date().toISOString()
    };

    const { resource } = await tripContainer.item(existingTrip.id, existingTrip.id).replace(updatedTrip);

    return resource;
  } catch (error) {
    console.error("Cosmos operation failed:", error);
    console.error("Cosmos DB update trip failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      tripId: id
    });

    throw new Error(`Failed to update trip: ${error.message}`);
  }
}

async function deleteTrip(id) {
  try {
    const tripContainer = getContainer();

    const existingTrip = await getTripById(id);

    await tripContainer.item(existingTrip.id, existingTrip.id).delete();
  } catch (error) {
    console.error("Cosmos operation failed:", error);
    console.error("Cosmos DB delete trip failed:", {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      tripId: id
    });

    throw new Error(`Failed to delete trip: ${error.message}`);
  }
}

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
};
