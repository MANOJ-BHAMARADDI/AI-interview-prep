import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const authService = {
  async register(userData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        userData
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        credentials
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout() {
    localStorage.removeItem("token");
  },

  isAuthenticated() {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Check if token is expired
      return payload.exp > Date.now() / 1000;
    } catch {
      // If token is invalid, remove it
      this.logout();
      return false;
    }
  },

  getToken() {
    return localStorage.getItem("token");
  },
};
