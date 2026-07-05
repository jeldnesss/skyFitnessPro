"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { getCourseById } from "@/services/courses.service";
import { CourseDetails } from "@/types/course";

import styles from "./page.module.css";
import Image from "next/image";
import AuthModal from "@/components/AuthModal/AuthModal";

import { addCourse, checkCourseAdded } from "@/utils/course";

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [isAuth, setIsAuth] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      const token = localStorage.getItem("token");
      setIsAuth(!!token);

      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);
  const handleAddCourse = async () => {
    if (!course) return;

    try {
      setAdding(true);

      const alreadyAdded = await checkCourseAdded(course._id);

      if (alreadyAdded) {
        setIsAdded(true);
        return;
      }

      await addCourse(course._id);

      setIsAdded(true);
      alert("Курс успешно добавлен!");
    } catch (error) {
      console.error(error);
      alert("Ошибка при добавлении курса");
    } finally {
      setAdding(false);
    }
  };
  const handleButtonClick = () => {
    if (!isAuth) {
      setIsModalOpen(true);
      return;
    }

    handleAddCourse();
  };

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId ]);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!course) {
    return <p>Курс не найден.</p>;
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.banner}>
          <h1 className={styles.title}>{course.nameRU}</h1>
        </div>
        <div className={styles.suit}>
          <h3 className={styles.block_text}>Подойдет для вас, если:</h3>

          <div className={styles.fitting}>
            {course.fitting.map((item, index) => (
              <div key={index} className={styles.fittingCard}>
                <p className={styles.fitting_index}>{index + 1}</p>
                <p className={styles.fitting_name}>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.directions}>
          <h3 className={styles.block_text}>Направления</h3>
          <div className={styles.direction_block}>
            <ul className={styles.list}>
              {course.directions.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  <Image
                    src="/sparcle.svg"
                    alt="check"
                    width={20}
                    height={20}
                  />
                  <span className={styles.direction_name}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.add}>
          <div className={styles.add_mask}>
            <div className={styles.add_desc}>
              <h3 className={styles.add_title}>Начните путь к новому телу</h3>
              <ul className={styles.add_list}>
                <li className={styles.add_list_item}>
                  проработка всех групп мышц
                </li>
                <li className={styles.add_list_item}>тренировка суставов</li>
                <li className={styles.add_list_item}>
                  улучшение циркуляции крови
                </li>
                <li className={styles.add_list_item}>
                  упражнения заряжают бодростью
                </li>
                <li className={styles.add_list_item}>
                  помогают противостоять стрессам
                </li>
              </ul>
              <button
                className={styles.button}
                onClick={handleButtonClick}
                disabled={adding}
              >
                {adding
                  ? "Добавление..."
                  : isAuth
                    ? "Добавить курс"
                    : "Войдите, чтобы добавить курс"}
              </button>
            </div>
            <Image
              className={styles.draw}
              src="/draw.svg"
              alt="check"
              width="629"
              height="424"
            />
          </div>

          <Image
            className={styles.man}
            src="/man.png"
            alt="check"
            width="487"
            height="542"
          />
        </div>
      </main>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
