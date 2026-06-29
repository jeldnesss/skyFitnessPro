import { api } from "@/lib/api";
import { LoginResponse, RegisterResponse } from "@/types/auth";
import { User } from "@/types/user";

export const register = async (
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const { data } = await api.post<RegisterResponse>("/auth/register", {
    email,
    password,
  });
  return data;
};

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });
  const token = data.token;
  localStorage.setItem("token", token);
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
  }
  return data;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};
