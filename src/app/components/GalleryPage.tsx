import { useEffect, useMemo, useState } from "react";
import { Camera, Filter, Search, Eye, Share2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Masonry from "react-responsive-masonry";
import { deleteTrip, fetchTrips, type Trip } from "../api";

interface GalleryPageProps {
  onSelectTrip: (trip: Trip) => void;
}

function getTitle(trip: Trip) {
  return trip.title || trip.placeName || trip.originalFileName || trip.fileName || "Untitled upload";
}

function isVideo(trip: Trip) {
  const mediaType = trip.mediaType || trip.contentType || "";
  return mediaType.startsWith("video");
}

function isImage(trip: Trip) {
  const mediaType = trip.mediaType || trip.contentType || "";
  return mediaType.startsWith("image");
}

export function GalleryPage({ onSelectTrip }: GalleryPageProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchTrips();
      setTrips(data);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load gallery.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return trips;
    }

    return trips.filter((trip) => {
      const searchableText = [
        trip.title,
        trip.placeName,
        trip.description,
        trip.review,
        Array.isArray(trip.tags) ? trip.tags.join(", ") : trip.tags,
        trip.category,
        trip.userName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search, trips]);

  const handleDelete = async (trip: Trip) => {
    if (!window.confirm("Are you sure you want to delete this picture?")) {
      return;
    }

    try {
      await deleteTrip(trip.id);
      setTrips((currentTrips) => currentTrips.filter((item) => item.id !== trip.id));
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "Delete failed.";
      setError(message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">My Photos</h1>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search photos"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="p-2 border-2 border-gray-300 rounded hover:bg-gray-100">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded border-2 border-gray-900">
              All Photos
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50">
              Albums
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50">
              Favorites
            </button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded border-2 border-gray-300 hover:bg-gray-50">
              Shared with me
            </button>
          </div>

          <div className="ml-auto">
            <select className="px-4 py-2 border-2 border-gray-300 rounded bg-white text-gray-700 font-medium focus:outline-none focus:border-blue-500">
              <option>Recent</option>
              <option>Oldest</option>
              <option>Most Liked</option>
              <option>Title A-Z</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-10 text-center text-gray-600">
            Loading gallery...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-lg p-4 mb-6">
            {error}
          </div>
        )}

        {!loading && filteredTrips.length === 0 && (
          <div className="bg-white border-2 border-gray-300 rounded-lg p-10 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No uploads yet</h2>
            <p className="text-gray-600">Upload your first photo or video to see it here.</p>
          </div>
        )}

        {!loading && filteredTrips.length > 0 && (
          <Masonry columnsCount={3} gutter="24px" className="mb-8">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="group relative bg-white border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => onSelectTrip(trip)}
                  className="block w-full text-left"
                >
                  <div className="h-64 bg-gray-200 flex items-center justify-center">
                    {trip.mediaUrl && isImage(trip) && (
                      <img
                        src={trip.mediaUrl}
                        alt={getTitle(trip)}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {trip.mediaUrl && isVideo(trip) && (
                      <video
                        src={trip.mediaUrl}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                    {(!trip.mediaUrl || (!isImage(trip) && !isVideo(trip))) && (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </button>

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 pointer-events-none">
                  <button className="p-3 bg-white rounded-full hover:bg-gray-100 pointer-events-auto" onClick={() => onSelectTrip(trip)}>
                    <Eye className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-3 bg-white rounded-full hover:bg-gray-100 pointer-events-auto">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    className="p-3 bg-white rounded-full hover:bg-red-50 pointer-events-auto"
                    onClick={() => handleDelete(trip)}
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-white font-medium">{getTitle(trip)}</p>
                  <p className="text-white/80 text-sm">
                    {trip.category || (Array.isArray(trip.tags) ? trip.tags.join(", ") : trip.tags) || "PhotoCloud upload"}
                  </p>
                </div>
              </div>
            ))}
          </Masonry>
        )}

        <div className="flex justify-center items-center gap-2 mt-8">
          <button className="px-3 py-2 border-2 border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button className="px-4 py-2 bg-gray-900 text-white font-medium rounded border-2 border-gray-900">
            1
          </button>

          <button className="px-3 py-2 border-2 border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-1">
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
