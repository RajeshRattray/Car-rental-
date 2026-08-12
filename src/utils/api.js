import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3000/api" });

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("carRentalUser") || "{}");
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getProfile = () => API.get("/auth/profile");
export const updateProfile = (data) => API.put("/auth/profile", data);

// Cars
export const getCars = (params) => API.get("/cars", { params });
export const getCarById = (id) => API.get(`/cars/${id}`);
export const createCar = (data) => API.post("/cars", data);
export const updateCar = (id, data) => API.put(`/cars/${id}`, data);
export const deleteCar = (id) => API.delete(`/cars/${id}`);

// Bookings
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = () => API.get("/bookings/my");
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
export const getAllBookings = (params) => API.get("/bookings", { params });
export const updateBookingStatus = (id, data) => API.put(`/bookings/${id}/status`, data);

// Admin
export const getDashboardStats = () => API.get("/admin/dashboard");
export const getAllUsers = () => API.get("/admin/users");
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle`);

export default API;
