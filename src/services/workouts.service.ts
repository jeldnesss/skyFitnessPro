import { api } from "@/lib/api";

export const getWorkoutById = async (workoutId: string) => {
  const { data } = await api.get(`/workouts/${workoutId}`);
  return data;
};

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

export const saveWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  progressData: number[],
) => {
  const { data } = await api.patch(
    `/courses/${courseId}/workouts/${workoutId}`,
    {
      progressData,
    },
  );

  return data;
};

export const resetWorkoutProgress = async (
  courseId: string,
  workoutId: string,
) => {
  const { data } = await api.patch(
    `/courses/${courseId}/workouts/${workoutId}/reset`,
  );

  return data;
};
