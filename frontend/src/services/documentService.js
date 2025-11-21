import api from "./api";

export async function uploadDocument(title, uploaded_file, manager_id) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("manager_id", manager_id);
  formData.append("uploaded_file", uploaded_file);

  try {
    const response = await api.post("/documents/upload/", formData);
    return response.data;
  } catch (error) {
    console.error("Document upload failed:", error);
    return null; // or some fallback value
  }
}

export async function createManager(name, club_id) {
  try {
    const response = await api.post("/clubs/managers/new", { params : { name, club_id }});
    return response.data;
  } catch (error) {
    console.error("Document upload failed:", error);
    return null; // or some fallback value
  }
}

export async function getManagers(club_id) {
  try {
    const response = await api.get("/clubs/managers/", { params : { club_id }});
    return response.data;
  } catch (error) {
    console.error("Document upload failed:", error);
    return null; // or some fallback value
  }
}

export async function getDocument(doc_id, manager_id) {
  if (doc_id == null && manager_id == null)
  {
    console.error("Missing fields");
    return null;
  }
  try {
    const response = await api.get("/clubs/managers/documents/", { params : { doc_id, manager_id }});
    return response.data;
  } catch (error) {
    console.error("Document upload failed:", error);
    return null; // or some fallback value
  }
}