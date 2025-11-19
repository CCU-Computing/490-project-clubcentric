import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export default api;