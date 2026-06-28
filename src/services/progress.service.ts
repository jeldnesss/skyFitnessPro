import { api } from "@/lib/api";

export const getCourseProgress = async (courseId: string) => {
  const { data } = await api.get(`/users/me/progress?courseId=${courseId}`);

  return data;
};

export const getWorkoutProgress = async (
  courseId: string,
  workoutId: string,
) => {
  const { data } = await api.get(
    `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
  );

  return data;
};
