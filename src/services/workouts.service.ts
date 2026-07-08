import { api } from "@/lib/api";
import { ApiMessage } from "@/types/api";
import { Workout } from "@/types/workouts";
export type WorkoutProgress = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};
export const getCourseWorkouts = async (
  courseId: string,
): Promise<Workout[]> => {
  const { data } = await api.get<Workout[]>(`/courses/${courseId}/workouts`);
  return data;
};

export const getWorkoutById = async (workoutId: string): Promise<Workout> => {
  const { data } = await api.get<Workout>(`/workouts/${workoutId}`);
  return data;
};

export const saveWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  progressData: number[],
): Promise<ApiMessage> => {
  const { data } = await api.patch<ApiMessage>(
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
): Promise<ApiMessage> => {
  const { data } = await api.patch<ApiMessage>(
    `/courses/${courseId}/workouts/${workoutId}/reset`,
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
