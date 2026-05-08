// API functions for TripCloud

// Get all trips
async function getTrips() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips`);
        if (!response.ok) {
            throw new Error('Failed to fetch trips');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching trips:', error);
        throw error;
    }
}

// Get a single trip by ID
async function getTrip(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch trip');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching trip:', error);
        throw error;
    }
}

// Create a new trip
async function createTrip(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: "Upload failed" }));
            throw new Error(error.message || error.error || "Upload failed");
        }

        return response.json();
    } catch (error) {
        console.error('Error creating trip:', error);
        throw error;
    }
}

// Update an existing trip
async function updateTrip(id, tripData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tripData)
        });
        if (!response.ok) {
            throw new Error('Failed to update trip');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating trip:', error);
        throw error;
    }
}

// Delete a trip
async function deleteTrip(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete trip');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting trip:', error);
        throw error;
    }
}
