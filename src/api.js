import axios from "axios";

const API = axios.create({
  baseURL: "https://digital-khata-backend-yalb.onrender.com"
});

// ✅ Attach token automatically
API.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token; // ✅ FIXED HERE
  }

  return config;
});

export default API;