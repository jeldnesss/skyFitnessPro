import { getMe } from "@/services/auth.service";
import { addCourseToUser, removeCourseFromUser } from "@/services/courses.service";
export const isUserAuth = () => {
  return !!localStorage.getItem("token");
};

export const checkCourseAdded = async (courseId: string) => {
  const res = await getMe();
  const user = res.user;

  return user.selectedCourses?.includes(courseId) ?? false;
};

export const addCourse = async (courseId: string) => {
  return await addCourseToUser(courseId);
};
export const removeCourse = async (courseId: string) => {
  try {
    const data = await removeCourseFromUser(courseId);
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Ошибка при удалении курса",
    };
  }
};
