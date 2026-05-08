// Edit page script for TripCloud

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');

    if (tripId) {
        loadTripForEdit(tripId);
    } else {
        alert('No trip ID provided');
        window.location.href = 'gallery.html';
    }

    const form = document.getElementById('edit-form');
    form.addEventListener('submit', handleEdit);
});

// Load trip data and populate the form
async function loadTripForEdit(tripId) {
    try {
        const trip = await getTrip(tripId);

        document.getElementById('trip-id').value = trip.id;
        document.getElementById('edit-title').value = trip.title;
        document.getElementById('edit-description').value = trip.description;
        document.getElementById('edit-location').value = trip.location;
        document.getElementById('edit-date').value = trip.date.split('T')[0]; // Format for date input
    } catch (error) {
        alert('Error loading trip data. Please try again.');
        console.error('Error loading trip for edit:', error);
        window.location.href = 'gallery.html';
    }
}

// Handle form submission for editing a trip
async function handleEdit(event) {
    event.preventDefault();

    const tripId = document.getElementById('trip-id').value;
    const tripData = {
        title: document.getElementById('edit-title').value,
        description: document.getElementById('edit-description').value,
        location: document.getElementById('edit-location').value,
        date: document.getElementById('edit-date').value
    };

    try {
        const result = await updateTrip(tripId, tripData);
        alert('Trip updated successfully!');
        // Redirect to gallery
        window.location.href = 'gallery.html';
    } catch (error) {
        alert('Error updating trip. Please try again.');
        console.error('Edit error:', error);
    }
}