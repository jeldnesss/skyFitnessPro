import { api } from "@/lib/api";
import { ApiMessage } from "@/types/api";
import { Course, CourseDetails } from "@/types/course";
import { Workout } from "@/types/workouts";

export const getCourses = async (): Promise<Course[]> => {
  const { data } = await api.get<Course[]>("/courses");
  return data;
};

export const getCourseById = async (
  courseId: string,
): Promise<CourseDetails> => {
  const { data } = await api.get<CourseDetails>(`/courses/${courseId}`);
  return data;
};

export const getCourseWorkouts = async (
  courseId: string,
): Promise<Workout[]> => {
  const { data } = await api.get<Workout[]>(`/courses/${courseId}/workouts`);
  return data;
};

export const addCourseToUser = async (
  courseId: string,
): Promise<ApiMessage> => {
  const { data } = await api.post<ApiMessage>("/users/me/courses", {
    courseId,
  });

  return data;
};

export const removeCourseFromUser = async (
  courseId: string,
): Promise<ApiMessage> => {
  const { data } = await api.delete<ApiMessage>(
    `/users/me/courses/${courseId}`,
  );
  return data;
};

export const resetCourseProgress = async (
  courseId: string,
): Promise<ApiMessage> => {
  const { data } = await api.patch<ApiMessage>(`/courses/${courseId}/reset`);

  return data;
};
