// services/clubService.js
import api from "./api"

export async function createClub({ name, description }) {
  try {
    const response = await api.post("/clubs/", { name, description });
    return response.data; // must return the created club object
  } catch (error) {
    console.error("Failed to create club:", error);
    return null;
  }
}
