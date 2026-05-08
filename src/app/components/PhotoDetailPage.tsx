import { useState } from "react";
import { Camera, User, Download, Share2, Edit, Trash2, Eye, Heart, ArrowLeft } from "lucide-react";
import { deleteTrip, updateTrip, type Trip } from "../api";

interface PhotoDetailPageProps {
  trip: Trip | null;
  onBack: () => void;
  onDeleted: () => void;
}

function getTitle(trip: Trip) {
  return trip.title || trip.placeName || trip.originalFileName || trip.fileName || "Untitled upload";
}

function getDescription(trip: Trip) {
  return trip.description || trip.review || "No description provided.";
}

function getAuthor(trip: Trip) {
  return trip.author || trip.userName || trip.userEmail || "PhotoCloud User";
}

function formatDate(date?: string) {
  if (!date) {
    return "Unknown date";
  }

  return new Date(date).toLocaleDateString();
}

function getTags(trip: Trip) {
  if (Array.isArray(trip.tags)) {
    return trip.tags;
  }

  const rawTags = trip.tags || trip.category || "";
  return rawTags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function isVideo(trip: Trip) {
  const mediaType = trip.mediaType || trip.contentType || "";
  return mediaType.startsWith("video");
}

function isImage(trip: Trip) {
  const mediaType = trip.mediaType || trip.contentType || "";
  return mediaType.startsWith("image");
}

export function PhotoDetailPage({ trip, onBack, onDeleted }: PhotoDetailPageProps) {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(trip);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(trip ? getTitle(trip) : "");
  const [editDescription, setEditDescription] = useState(trip ? getDescription(trip) : "");
  const [editTags, setEditTags] = useState(trip ? getTags(trip).join(", ") : "");
  const [editPrivacy, setEditPrivacy] = useState(trip?.privacy || "Public");
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    if (!currentTrip || !window.confirm("Are you sure you want to delete this picture?")) {
      return;
    }

    try {
      await deleteTrip(currentTrip.id);
      onDeleted();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Delete failed.";
      window.alert(message);
    }
  };

  const handleEdit = async () => {
    if (!currentTrip) {
      return;
    }

    setStatus("");
    setErrorMessage("");

    try {
      const updatedTrip = await updateTrip(currentTrip.id, {
        title: editTitle,
        description: editDescription,
        tags: editTags,
        privacy: editPrivacy,
        placeName: editTitle,
        category: editTags || "Other",
        review: editDescription,
      });

      setCurrentTrip(updatedTrip);
      setIsEditing(false);
      setStatus("Picture details updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed.";
      setErrorMessage(message);
    }
  };

  if (!currentTrip) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white border-2 border-gray-300 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No photo selected</h1>
            <p className="text-gray-600 mb-6">Choose an item from My Gallery to view details.</p>
            <button
              onClick={onBack}
              className="px-5 py-3 bg-blue-600 text-white font-semibold rounded border-2 border-blue-700 hover:bg-blue-700"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tags = getTags(currentTrip);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 lg:w-[70%]">
            <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden mb-6">
              <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center">
                {currentTrip.mediaUrl && isImage(currentTrip) && (
                  <img
                    src={currentTrip.mediaUrl}
                    alt={getTitle(currentTrip)}
                    className="w-full h-full object-contain bg-black"
                  />
                )}
                {currentTrip.mediaUrl && isVideo(currentTrip) && (
                  <video
                    src={currentTrip.mediaUrl}
                    className="w-full h-full bg-black"
                    controls
                  />
                )}
                {(!currentTrip.mediaUrl || (!isImage(currentTrip) && !isVideo(currentTrip))) && (
                  <Camera className="w-24 h-24 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="lg:w-[30%]">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 sticky top-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{getTitle(currentTrip)}</h1>

              {status && (
                <p className="mb-4 p-3 bg-green-50 border-2 border-green-200 text-green-700 rounded text-sm font-medium">
                  {status}
                </p>
              )}

              {errorMessage && (
                <p className="mb-4 p-3 bg-red-50 border-2 border-red-200 text-red-700 rounded text-sm font-medium">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getAuthor(currentTrip)}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded on {formatDate(currentTrip.createdAt)}
                  </p>
                </div>
              </div>

              {isEditing ? (
                <div className="mb-4 pb-4 border-b-2 border-gray-200 space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Title</label>
                    <input
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(event) => setEditDescription(event.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Tags</label>
                    <input
                      value={editTags}
                      onChange={(event) => setEditTags(event.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Privacy</label>
                    <select
                      value={editPrivacy}
                      onChange={(event) => setEditPrivacy(event.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option>Public</option>
                      <option>Private</option>
                      <option>Shared Link</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded border-2 border-blue-700 hover:bg-blue-700 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 pb-4 border-b-2 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{getDescription(currentTrip)}</p>
                  </div>

                  <div className="mb-4 pb-4 border-b-2 border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {(tags.length > 0 ? tags : ["uncategorized"]).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full border border-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Stats</h3>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">1 view</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {currentTrip.rating ? `${currentTrip.rating}/5` : "No rating"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {currentTrip.mediaUrl && (
                  <a
                    href={currentTrip.mediaUrl}
                    download
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded border-2 border-blue-700 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 bg-white text-red-600 font-medium rounded border-2 border-red-300 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
