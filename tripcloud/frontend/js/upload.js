// Upload page script for TripCloud

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    form.addEventListener("submit", handleUpload);
});

async function handleUpload(event) {
    event.preventDefault();

    const form = event.target;
    const message = document.getElementById("uploadMessage");

    message.textContent = "";
    message.className = "form-message";

    const formData = new FormData(form);

    const photo = formData.get("photo");
    if (!photo || !photo.name) {
        message.textContent = "Please choose a photo or video first.";
        message.classList.add("error-message");
        return;
    }

    const placeName = formData.get("placeName") || "Untitled Trip";
    const review = formData.get("review") || "No description provided";
    const category = formData.get("category") || "Travel";

    formData.set("title", placeName);
    formData.set("description", review);
    formData.set("tags", category);
    formData.set("privacy", "Public");
    formData.set("userEmail", "guest@tripcloud.local");

    try {
        await createTrip(formData);
        message.textContent = "Trip post uploaded successfully!";
        message.classList.add("success-message");
        form.reset();

        setTimeout(() => {
            window.location.href = "gallery.html?v=" + Date.now();
        }, 800);
    } catch (error) {
        console.error("Upload error:", error);
        message.textContent = error.message || "Upload failed. Please try again.";
        message.classList.add("error-message");
    }
}