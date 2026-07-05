"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/services/auth.service";
import { getCourseById } from "@/services/courses.service";
import { CourseDetails, WorkoutProgress } from "@/types/course";

import styles from "./page.module.css";
import CourseCard from "@/components/CourseCard/CourseCard";
import { removeCourse } from "@/utils/course";
import { getCourseProgress } from "@/services/progress.service";
import Image from "next/image";
const courseImages = [
  "/image 5.jpg",
  "/image 6.jpg",
  "/image 7.jpg",
  "/image 8.jpg",
  "/image 9.jpg",
];
type User = {
  email: string;
  selectedCourses: string[];
};
type CourseWithProgress = CourseDetails & {
  progress: WorkoutProgress[];
};
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMe();
        const userData = data.user ?? data;

        setUser(userData);

        const coursesData = await Promise.all(
          userData.selectedCourses.map(async (id: string) => {
            const course = await getCourseById(id);
            const progress = await getCourseProgress(id);

            return {
              ...course,
              progress: progress?.workoutsProgress ?? [],
            };
          }),
        );

        setCourses(coursesData);
      } catch (error) {
        console.error(error);
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
  const calculateCourseProgressFromProgress = (
    progress: WorkoutProgress[] = [],
  ) => {
    if (!progress.length) return 0;

    let total = 0;
    let max = 0;

    progress.forEach((w) => {
      w.progressData?.forEach((value) => {
        total += value;
        max += 100;
      });
    });

    if (max === 0) return 0;

    return Math.min(Math.round((total / max) * 100), 100);
  };
  if (loading) return <p>Загрузка...</p>;

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
          <h3 className={styles.profileName}>Сергей</h3>

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
              image={courseImages[index % courseImages.length]}
              variant="profile"
              progress={calculateCourseProgressFromProgress(course.progress)}
              onRemove={handleRemoveCourse}
            />
          ))}
        </div>
      )}
    </main>
  );
}
