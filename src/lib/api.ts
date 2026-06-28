import axios from "axios";
export const api = axios.create({
  baseURL: "/api/fitness",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || "Ошибка сервера";

    console.error("API Error:", message);

    return Promise.reject(error);
  },
);
