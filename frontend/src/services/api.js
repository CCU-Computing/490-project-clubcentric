import axios from "axios";

function getCookie(name) 
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
        "X-CSRFToken": getCookie("csrftoken")
    },
    withCredentials: true
});

export default api;