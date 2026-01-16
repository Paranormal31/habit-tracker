import axios from "axios";

const API = axios.create({
  baseURL: "https://habit-tracker-backend-qgvy.onrender.com/api",
});

// ✅ STEP 10: ADD THIS BLOCK EXACTLY HERE
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
