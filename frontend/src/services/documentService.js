import api from "./api";

export async function uploadDocument(file, title)
{
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);

    const response = await api.post("/documents/", formData);
    return response.data;
}