import axios from "axios";

// Define API_URL with fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || "https://volunteershub-6.onrender.com";

// Create configured axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

const getDashboardStats = async (token) => {
  const response = await api.get("/api/analytics/dashboard", {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

const getVolunteerAnalytics = async (token) => {
  const response = await api.get("/api/analytics/volunteers", {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

const getEventAnalytics = async (token) => {
  const response = await api.get("/api/analytics/events", {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

const analyticsService = {
  getDashboardStats,
  getVolunteerAnalytics: getVolunteerAnalytics,
  getEventAnalytics
};

export default analyticsService;