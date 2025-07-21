import { create } from "zustand";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use a fallback for environment detection in React Native
const API_URL =
  process.env.NODE_ENV === "development" ? "http://127.0.0.1:4001/api" : "/api";

axios.defaults.withCredentials = true;

export type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: string;
  fromGoogle?: boolean;
};

type AuthStore = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signup: (
    name: string,
    username: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;

  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (identifier: string) => Promise<void>;
  resetPassword: (otpCode: string, newPassword: string) => Promise<void>;
  callBack: (code: string) => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setError: (error) => set({ error }),

  signup: async (name, username, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        name,
        username,
        email,
        password,
        phone,
      });

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      console.log("Signup error:", err.response?.data || err.message || err);
      set({
        error: err.response?.data?.message || "Error signing up",
        isLoading: false,
      });
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        identifier,
        password,
      });

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error logging in",
        isLoading: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Error logging out",
        isLoading: false,
      });
    }
  },

  forgotPassword: async (identifier) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { identifier });
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to send reset link",
        isLoading: false,
      });
    }
  },

  resetPassword: async (otpCode, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(`${API_URL}/auth/reset-password`, {
        otpCode,
        newPassword,
      });
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Reset failed",
        isLoading: false,
      });
    }
  },

  callBack: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/google/callback`, {
        code,
      });
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      console.log("Google callback error:", err.response?.data || err.message);
      set({
        isLoading: false,
        error: err.response?.data?.message || err.message || "Login failed",
      });
    }
  },
}));
