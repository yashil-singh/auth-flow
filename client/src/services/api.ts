import axios from "axios";
import { BASE_API_URL } from "../lib/constants";
import useAuthStore from "@/lib/stores/authStore";

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const POST = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.post(endpoint, body);
  return response.data;
};

export const GET = async (endpoint: string = "", params?: URLSearchParams) => {
  const response = await api.get(endpoint, { params });
  return response.data;
};

export const PATCH = async <T>(endpoint: string = "", body?: T) => {
  const response = await api.patch(endpoint, body);
  return response.data;
};

export const DELETE = async (endpoint: string = "") => {
  const response = await api.delete(endpoint);
  return response.data;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      try {
        const setIsLoading = useAuthStore.getState().setIsLoading;

        setIsLoading(true);

        const response = await GET("/auth/refresh");

        const { data } = response;
        const newAccessToken = data.accessToken;

        const setAccessToken = useAuthStore.getState().setAccessToken;

        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch {
        const logoutUser = useAuthStore.getState().logoutUser;
        logoutUser();
        return Promise.reject(error);
      }
    }

    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
