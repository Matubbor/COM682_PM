import { useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { uploadTrip } from "../api";

function getCurrentUserName() {
  try {
    const savedUser = localStorage.getItem("tripcloud_current_user");

    if (!savedUser) {
      return "PhotoCloud User";
    }

    const user = JSON.parse(savedUser);
    return user.fullName || user.email || "PhotoCloud User";
  } catch {
    return "PhotoCloud User";
  }
}

function getCurrentUserEmail() {
  try {
    const savedUser = localStorage.getItem("tripcloud_current_user");

    if (!savedUser) {
      return "guest@tripcloud.local";
    }

    const user = JSON.parse(savedUser);
    return user.email || "guest@tripcloud.local";
  } catch {
    return "guest@tripcloud.local";
  }
}

export function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [privacy, setPrivacy] = useState("Public");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags("");
    setPrivacy("Public");
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    setStatus("");
    setError("");

    if (!selectedFile) {
      setError("Please select an image or video file.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("tags", tags.trim());
    formData.append("privacy", privacy);

    formData.append("placeName", title.trim());
    formData.append("city", "");
    formData.append("country", "Unknown");
    formData.append("category", tags.trim() || "Other");
    formData.append("review", description.trim());
    formData.append("rating", "5");
    formData.append("userName", getCurrentUserName());
    formData.append("userEmail", getCurrentUserEmail());

    try {
      setIsUploading(true);
      setStatus("Uploading...");
      await uploadTrip(formData);
      setStatus("Upload successful.");
      resetForm();
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Upload failed.";
      setError(message);
      setStatus("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload to PhotoCloud</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-3/5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white border-2 border-dashed border-gray-400 rounded-lg p-12 flex flex-col items-center justify-center min-h-[400px] hover:border-blue-500 transition-colors cursor-pointer"
            >
              <CloudUpload className="w-20 h-20 text-gray-400 mb-4" />
              <p className="text-xl text-gray-700 font-medium mb-2">
                Drag & Drop photos here
              </p>
              <p className="text-sm text-blue-600 underline hover:text-blue-700">
                or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </button>

            <div className="mt-6 bg-white border-2 border-gray-300 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files</h3>

              {selectedFile ? (
                <div className="p-3 bg-gray-50 border border-gray-300 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 font-medium">
                      {selectedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-300">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: isUploading ? "65%" : status ? "100%" : "0%" }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No file selected yet.</p>
              )}

              {status && (
                <p className="mt-4 p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded font-medium">
                  {status}
                </p>
              )}

              {error && (
                <p className="mt-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded font-medium">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="lg:w-2/5">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Settings</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Enter photo title"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Enter photo description"
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="e.g., vacation, family"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Privacy</label>
                <div className="flex border-2 border-gray-300 rounded overflow-hidden">
                  {["Public", "Private", "Shared Link"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPrivacy(option)}
                      className={`flex-1 px-4 py-2 font-medium border-r border-gray-300 last:border-r-0 ${
                        privacy === option
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded border-2 border-blue-700 hover:bg-blue-700 disabled:bg-blue-300 disabled:border-blue-300 transition-colors"
              >
                {isUploading ? "Uploading..." : "Upload Photos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
