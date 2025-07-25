import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { interviewService } from "../services/interviewService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          // Try to get user profile
          const userData = await interviewService.getUserProfile();
          setUser(userData);
        }
      } catch (err) {
        // If there's an error, clear auth state
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (data.token) {
        // Get user profile after successful login
        try {
          const userData = await interviewService.getUserProfile();
          setUser(userData);
          return { success: true };
        } catch (profileErr) {
          // If profile fetch fails, still consider login successful
          setUser({
            id: data._id,
            name: data.name,
            email: data.email,
          });
          return { success: true };
        }
      } else {
        return { success: false, message: "Login failed" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password });
      if (data.token) {
        setUser({
          id: data._id,
          name: data.name,
          email: data.email,
        });
        return { success: true };
      } else {
        return { success: false, message: "Registration failed" };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (userData) => {
    try {
      const updatedUser = await interviewService.updateUserProfile(userData);
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUser,
      }));
      return { success: true, data: updatedUser };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user && authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
