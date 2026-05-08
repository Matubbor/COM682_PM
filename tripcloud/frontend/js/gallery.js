// Gallery page script for TripCloud

document.addEventListener('DOMContentLoaded', function() {
    loadAllTrips();
});

// Load and display all trip posts
async function loadAllTrips() {
    const container = document.getElementById('gallery-container');

    try {
        const trips = await getTrips();

        if (trips.length === 0) {
            container.innerHTML = '<p>No trips available yet. Be the first to share!</p>';
            return;
        }

        container.innerHTML = trips.map(trip => createTripCardWithActions(trip)).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading trips. Please try again later.</p>';
        console.error('Error loading all trips:', error);
    }
}

// Create HTML for a trip card with edit/delete actions
function createTripCardWithActions(trip) {
    const mediaElement = trip.mediaUrl ?
        (trip.mediaType === 'video' ?
            `<video class="trip-media" controls><source src="${trip.mediaUrl}" type="video/mp4"></video>` :
            `<img src="${trip.mediaUrl}" alt="${trip.title}" class="trip-media">`) :
        '<div class="trip-media" style="background-color: #ddd; display: flex; align-items: center; justify-content: center;">No Media</div>';

    return `
        <div class="trip-card">
            ${mediaElement}
            <div class="trip-content">
                <h3 class="trip-title">${trip.title}</h3>
                <p class="trip-description">${trip.description}</p>
                <p class="trip-meta">Location: ${trip.location} | Date: ${new Date(trip.date).toLocaleDateString()}</p>
                <div class="trip-actions">
                    <a href="edit.html?id=${trip.id}" class="btn btn-edit">Edit</a>
                    <button class="btn btn-delete" onclick="deleteTripHandler('${trip.id}')">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Handle trip deletion
async function deleteTripHandler(tripId) {
    if (!confirm('Are you sure you want to delete this trip?')) {
        return;
    }

    try {
        await deleteTrip(tripId);
        alert('Trip deleted successfully!');
        // Reload the gallery
        loadAllTrips();
    } catch (error) {
        alert('Error deleting trip. Please try again.');
        console.error('Delete error:', error);
    }
}