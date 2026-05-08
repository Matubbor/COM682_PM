// Upload page script for TripCloud

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    form.addEventListener('submit', handleUpload);
});

// Handle form submission for uploading a new trip
async function handleUpload(event) {
    event.preventDefault();

    const form = event.target;
    const message = document.getElementById('uploadMessage');
    const fileInput = document.getElementById('file');

    message.textContent = '';
    message.className = 'form-message';

    const formData = new FormData();

    // Backend expects the file field name to be "photo"
    formData.append('photo', fileInput.files[0]);

    formData.append('placeName', document.getElementById('placeName').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('country', document.getElementById('country').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('review', document.getElementById('review').value);
    formData.append('rating', document.getElementById('rating').value);
    formData.append('userName', document.getElementById('userName').value);

    // Extra fields required by backend
    formData.append('title', document.getElementById('placeName').value);
    formData.append('description', document.getElementById('review').value);
    formData.append('tags', document.getElementById('category').value);
    formData.append('privacy', 'Public');
    formData.append('userEmail', 'guest@tripcloud.local');

    // Backend requires title and description
    formData.append('title', document.getElementById('placeName').value);
    formData.append('description', document.getElementById('review').value);
    formData.append('tags', document.getElementById('category').value);
    formData.append('privacy', 'Public');
    formData.append('userEmail', 'guest@tripcloud.local');

    try {
        await createTrip(formData);
        message.textContent = 'Trip post uploaded successfully!';
        message.classList.add('success-message');
        form.reset();
    } catch (error) {
        console.error('Upload error:', error);
        message.textContent = error.message || 'Upload failed. Please try again.';
        message.classList.add('error-message');
    }
}