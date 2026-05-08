export const API_BASE_URL = "http://localhost:3000";

export interface Trip {
  id: string;
  title?: string;
  description?: string;
  placeName?: string;
  review?: string;
  category?: string;
  tags?: string | string[];
  privacy?: string;
  rating?: number;
  userName?: string;
  userEmail?: string;
  author?: string;
  mediaUrl?: string;
  mediaType?: string;
  contentType?: string;
  originalFileName?: string;
  fileName?: string;
  createdAt?: string;
  updatedAt?: string;
}

function normalizeTripsResponse(data: any): Trip[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.trips)) {
    return data.trips;
  }

  return [];
}

function normalizeTripResponse(data: any): Trip {
  return data?.trip || data;
}

export async function uploadTrip(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/trips`, {
    method: "POST",
    body: formData,
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Upload failed. Please try again."
    );
  }

  return data;
}

export async function getTrips() {
  const response = await fetch(`${API_BASE_URL}/api/trips`);

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to fetch trips."
    );
  }

  return normalizeTripsResponse(data);
}

export async function getTripById(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/trips/${id}`);

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to fetch trip."
    );
  }

  return normalizeTripResponse(data);
}

export async function deleteTrip(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
    method: "DELETE",
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to delete trip."
    );
  }

  return data;
}

export async function updateTrip(id: string, updatedData: Partial<Trip>) {
  const response = await fetch(`${API_BASE_URL}/api/trips/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

  let data: any = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to update trip."
    );
  }

  return normalizeTripResponse(data);
}

export const fetchTrips = getTrips;
export const fetchTripById = getTripById;
export const createTrip = uploadTrip;
