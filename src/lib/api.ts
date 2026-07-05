import axios from "axios";
export const api = axios.create({
  baseURL: "https://wedev-api.sky.pro/api/fitness",
  headers: {
    "Content-Type": "",
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
    return Promise.reject(error);
  },
);
