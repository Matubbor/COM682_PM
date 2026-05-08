// Home page script for TripCloud

document.addEventListener('DOMContentLoaded', function() {
    loadRecentTrips();
});

// Load and display recent trip posts
async function loadRecentTrips() {
    const container = document.getElementById('recent-trips-container');

    try {
        const trips = await getTrips();
        // Show only the 6 most recent trips
        const recentTrips = trips.slice(0, 6);

        if (recentTrips.length === 0) {
            container.innerHTML = '<p>No trips available yet. Be the first to share!</p>';
            return;
        }

        container.innerHTML = recentTrips.map(trip => createTripCard(trip)).join('');
    } catch (error) {
        container.innerHTML = '<p>Error loading trips. Please try again later.</p>';
        console.error('Error loading recent trips:', error);
    }
}

// Create HTML for a trip card
function createTripCard(trip) {
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
            </div>
        </div>
    `;
}