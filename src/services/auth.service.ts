import { api } from "@/lib/api";

export const register = async (email: string, password: string) => {
  const { data } = await api.post("/auth/register", {
    email,
    password,
  });
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post<{ token: string }>("/auth/login", {
    email,
    password,
  });
  const token = data.token;
  localStorage.setItem("token", token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getMe = async () => {
  const { data } = await api.get("/users/me");
  return data;
};
