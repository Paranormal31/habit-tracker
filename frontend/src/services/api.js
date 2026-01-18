import axios from "axios";

console.log("API FILE LOADED"); // 🔴 debug line

const API = axios.create({
  baseURL: "https://habit-tracker-backend-qgvy.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("INTERCEPTOR TOKEN:", token); // 🔴 debug line

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
