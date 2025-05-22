import axios from "axios";
import { getToken } from "./authService"; // Adjust the import path as necessary
const API_URL = process.env.REACT_APP_API_URL + "/admin";

// Set auth header for all requests
axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

export const getAdmins = async (status = "") => {
  try {
    const response = await axios.get(`${API_URL}?status=${status}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch admins";
  }
};

export const updateAdmin = async (id, adminData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, adminData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update admin";
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete admin";
  }
};

export const forgotAdminPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to send reset email";
  }
};

export const resetAdminPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to reset password";
  }
};
