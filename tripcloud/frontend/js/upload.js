// Upload page script for TripCloud

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", handleUpload);
});

async function handleUpload(event) {
    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("uploadMessage");
    const fileInput = document.getElementById("file");

    message.textContent = "";
    message.className = "form-message";

    if (!fileInput.files || fileInput.files.length === 0) {
        message.textContent = "Please choose a photo or video first.";
        message.classList.add("error-message");
        return;
    }

    const placeName = document.getElementById("placeName").value;
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;
    const category = document.getElementById("category").value;
    const review = document.getElementById("review").value;
    const rating = document.getElementById("rating").value;
    const userName = document.getElementById("userName").value;

    const formData = new FormData();

    // Backend server.js expects upload.single("photo")
    formData.append("photo", fileInput.files[0]);

    // Frontend display fields
    formData.append("placeName", placeName);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("category", category);
    formData.append("review", review);
    formData.append("rating", rating);
    formData.append("userName", userName);

    // Backend required fields
    formData.append("title", placeName);
    formData.append("description", review);
    formData.append("tags", category);
    formData.append("privacy", "Public");
    formData.append("userEmail", "guest@tripcloud.local");

    try {
        await createTrip(formData);
        message.textContent = "Trip post uploaded successfully!";
        message.classList.add("success-message");
        form.reset();

        setTimeout(() => {
            window.location.href = "gallery.html?v=" + Date.now();
        }, 700);
    } catch (error) {
        console.error("Upload error:", error);
        message.textContent = error.message || "Upload failed. Please try again.";
        message.classList.add("error-message");
    }
}