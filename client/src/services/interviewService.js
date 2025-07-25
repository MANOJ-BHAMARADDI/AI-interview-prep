import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create axios instance with better error handling
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const interviewService = {
  async startInterview(interviewData) {
    try {
      const response = await api.post("/api/interview", interviewData);
      return response.data;
    } catch (error) {
      console.error(
        "Start interview error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async submitAnswer(interviewId, answer) {
    try {
      const response = await api.post(`/api/interview/${interviewId}/answer`, {
        answer,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Submit answer error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getInterviewHistory() {
    try {
      console.log("Fetching interview history...");
      const response = await api.get("/api/interview");
      console.log("Interview history response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Get interview history error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getInterviewById(id) {
    try {
      const response = await api.get(`/api/interview/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        "Get interview by ID error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async getUserProfile() {
    try {
      const response = await api.get("/api/user/me");
      return response.data;
    } catch (error) {
      console.error(
        "Get user profile error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  async updateUserProfile(userData) {
    try {
      const response = await api.put("/api/user/me", userData);
      return response.data;
    } catch (error) {
      console.error(
        "Update user profile error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
