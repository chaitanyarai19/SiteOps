import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:5000/api";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Required if you're using cookies/sessions
});

// Request interceptor to attach token if exists
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ======= AUTH =======
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);

// ======= SITES =======
export const getAllSites = () => api.get("/sites");
export const createSite = (data) => api.post("/sites", data);

// ======= TICKETS =======
export const getAllTickets = () => api.get("/tickets");
export const createTicket = (data) => api.post("/tickets", data);

// ======= USERS =======
export const getAllUsers = () => api.get("/users");

// Default export if needed elsewhere
export default api;
