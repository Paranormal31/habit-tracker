import axios from "axios";

const API = axios.create({
  baseURL: "https://habit-tracker-backend-qgvy.onrender.com/api",
});

export default API;
