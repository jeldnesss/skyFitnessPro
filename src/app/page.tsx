"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getCourses } from "@/services/courses.service";
import { Course } from "@/types/course";
import CourseCard from "@/components/CourseCard/CourseCard";
import { courseImages, defaultCourseImage } from "@/constants/courseImages";
export default function HomePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();

        setCourses(data);
      } catch (error) {
        setError("Не удалось загрузить курсы");
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  if (loading) return <p>Загрузка...</p>;

  if (error) return <p>{error}</p>;
  return (
    <main className={styles.main}>
      <div className={styles.main__title_wrapper}>
        <h1 className={styles.title}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <div className={styles.title_note}>
          <p className={styles.title_note__text}>
            Измени своё тело за полгода!
          </p>
        </div>
      </div>
      <div className={styles.cards_block}>
        {loading && <p>Загрузка...</p>}

        {courses.map((course, index) => (
          <CourseCard
            key={course._id}
            course={course}
            image={courseImages[course._id] ?? defaultCourseImage}
          />
        ))}
      </div>
      <button className={styles.scrollTop} onClick={scrollToTop}>
        Наверх ↑
      </button>
    </main>
  );
}
