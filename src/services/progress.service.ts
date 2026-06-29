import { api } from "@/lib/api";
import { Progress, WorkoutProgress } from "@/types/progress";

export const getCourseProgress = async (
  courseId: string,
): Promise<Progress> => {
  const { data } = await api.get<Progress>(
    `/users/me/progress?courseId=${courseId}`,
  );

  return data;
};

export const getWorkoutProgress = async (
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress> => {
  const { data } = await api.get<WorkoutProgress>(
    `/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
  );

  return data;
};
