"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/auth.service";
import { getCourseById } from "@/services/courses.service";
import { CourseDetails, WorkoutProgress } from "@/types/course";

import styles from "./page.module.css";
import CourseCard from "@/components/CourseCard/CourseCard";
import { removeCourse } from "@/utils/course";

import Image from "next/image";
import { getCourseWorkouts } from "@/services/workouts.service";
import { courseImages, defaultCourseImage } from "@/constants/courseImages";
type User = {
  email: string;
  selectedCourses: string[];
  courseProgress: {
    courseId: string;
    courseCompleted: boolean;
    workoutsProgress: {
      workoutId: string;
      workoutCompleted: boolean;
      progressData: number[];
    }[];
  }[];
};
type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: {
    _id: string;
    name: string;
    quantity: number;
  }[];
};
type CourseWithProgress = CourseDetails & {
  progress: WorkoutProgress[];
  workoutsCount: number;
};
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMe();
        const userData = data.user ?? data;

        setUser(userData);

        const coursesData = await Promise.all(
          userData.selectedCourses.map(async (id: string) => {
            const course = await getCourseById(id);
            const workouts = await getCourseWorkouts(id);
            const courseProgress = userData.courseProgress.find(
              (p) => p.courseId === id,
            );

            return {
              ...course,
              progress: courseProgress?.workoutsProgress ?? [],
              workoutsCount: workouts.length,
            };
          }),
        );

        setCourses(coursesData);
      } catch (error) {
        setError("Не удалось загрузить профиль.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);
  const handleRemoveCourse = async (id: string) => {
    await removeCourse(id);

    setCourses((prev) => prev.filter((course) => course._id !== id));
  };
  const calculateCourseProgress = (
    progress: WorkoutProgress[],
    workoutsCount: number,
  ) => {
    if (!workoutsCount) return 0;

    const done = progress.filter((w) => w.workoutCompleted).length;

    return Math.round((done / workoutsCount) * 100);
  };
  if (loading) return <p>Загрузка...</p>;
  if (error) {
    return <p>{error}</p>;
  }
  if (!user) return <p>Нет данных пользователя</p>;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Профиль</h1>

      <div className={styles.userInfo}>
        <Image
          className={styles.image}
          width={197}
          height={197}
          src={"/profile.svg"}
          alt="profile"
        ></Image>
        <div className={styles.profileInfoText}>
          <h3 className={styles.profileName}>Вы</h3>

          <p className={styles.email}>Логин: {user.email}</p>
          <button className={styles.profileButton}>Выйти</button>
        </div>
      </div>

      <h2 className={styles.title}>Мои курсы</h2>

      {courses.length === 0 ? (
        <p>Вы ещё не добавили курсы</p>
      ) : (
        <div className={styles.courses}>
          {courses.map((course, index) => (
            <CourseCard
              key={course._id}
              course={course}
              image={courseImages[course._id] ?? defaultCourseImage}
              variant="profile"
              progress={calculateCourseProgress(
                course.progress,
                course.workoutsCount,
              )}
              workoutsProgress={course.progress}
              onRemove={handleRemoveCourse}
            />
          ))}
        </div>
      )}
    </main>
  );
}
