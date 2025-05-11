import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// import { User } from "../models/User";
import { dummyUser } from "../data/dummyData";

// Create a dedicated API instance for auth operations
const authApi = axios.create({
  baseURL: "https://rent-mate-api.duckdns.org",
  headers: {
    "Content-Type": "application/json",
  },
  allowAbsoluteUrls: false,
});

// Add request interceptor for authentication
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

interface AuthContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ isFirstLogin: boolean }>;
  signup: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch authorized user data
  const fetchAuthorizedUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Call the authorized-user API to get current user data
        const response = await authApi.get("/api/users/authorized-user");

        // Set user from response data
        setUser({
          email: response.data.email,
          role: response.data.role,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          id: response.data.id,
          householdId: response.data.householdId,
          firstLogin: response.data.firstLogin,
          ...response.data,
        });

        return response.data;
      }
    } catch (err) {
      console.error("Failed to fetch authorized user:", err);
      // If API call fails, remove the token as it might be invalid
      localStorage.removeItem("authToken");
      setUser(null);
    }
    return null;
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Fetch current user data
          await fetchAuthorizedUser();
        }
      } catch (err) {
        localStorage.removeItem("authToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // First authenticate with email and password
      const loginResponse = await authApi.post("api/users/login", {
        email,
        password,
      });

      // Store the access token from the response
      localStorage.setItem("authToken", loginResponse.data.accessToken);

      // Now fetch the complete user profile using the authorized-user endpoint
      const userData = await fetchAuthorizedUser();

      // Return whether this is the user's first login
      return {
        isFirstLogin:
          userData?.firstLogin || loginResponse.data.isFirstLogin || false,
        user: userData,
      };
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.post("api/users/register", {
        firstName,
        lastName,
        email,
        password,
      });
      localStorage.setItem("authToken", response.data.token);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to signup");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // await authApi.post("api/auth/logout");
      localStorage.removeItem("authToken");
      setUser(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
