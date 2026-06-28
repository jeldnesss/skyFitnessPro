import { api } from "@/lib/api";

export const getCourses = async () => {
  const { data } = await api.get("/courses");
  return data;
};

export const getCourseById = async (courseId: string) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
};

export const getCourseWorkouts = async (courseId: string) => {
  const { data } = await api.get(`/courses/${courseId}/workouts`);
  return data;
};

export const addCourseToUser = async (courseId: string) => {
  const { data } = await api.post("/users/me/courses", {
    courseId,
  });

  return data;
};

export const removeCourseFromUser = async (courseId: string) => {
  const { data } = await api.delete(`/users/me/courses/${courseId}`);
  return data;
};

export const resetCourseProgress = async (courseId: string) => {
  const { data } = await api.patch(`/courses/${courseId}/reset`);

  return data;
};
