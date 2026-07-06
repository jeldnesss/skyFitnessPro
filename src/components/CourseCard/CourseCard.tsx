"use client";
import Image from "next/image";
import styles from "./CourseCard.module.css";
import { CourseDetails, WorkoutProgress } from "@/types/course";
import Link from "next/link";
import { useState } from "react";
import { addCourseToUser } from "@/services/courses.service";
import { AxiosError } from "axios";
import { removeCourse } from "@/utils/course";
import { useRouter } from "next/navigation";
import { getCourseWorkouts } from "@/services/workouts.service";
import WorkoutSelectModal from "../WorkoutSelectModal/WorkoutSelectModal";
import { Workout } from "@/types/workouts";

type Props = {
  course: CourseDetails;
  image: string;
  variant?: "default" | "profile";
  progress?: number;
  workoutsProgress?: WorkoutProgress[];
  onRemove?: (id: string) => void;
};

export default function CourseCard({
  course,
  image,
  variant = "default",
  progress = 0,
  workoutsProgress = [],
  onRemove,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const router = useRouter();
  const handleContinue = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const data = await getCourseWorkouts(course._id);

      if (!Array.isArray(data) || data.length === 0) {
        alert("У курса пока нет тренировок");
        return;
      }

      setWorkouts(data);
      setIsModalOpen(true);
    } catch (error) {
      alert("Не удалось загрузить тренировки");
    }
  };
  const handleSelectWorkout = (workoutId: string) => {
    setIsModalOpen(false);

    router.push(`/course/${course._id}/workout/${workoutId}`);
  };
  const handleAddCourse = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (adding) return;

    try {
      setAdding(true);

      await addCourseToUser(course._id);

      alert("Курс добавлен!");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      const message = err.response?.data?.message;

      if (message === "Курс уже был добавлен!") {
        alert("Ты уже добавил этот курс");
        return;
      }

      alert(message || "Ошибка добавления курса");
    } finally {
      setAdding(false);
    }
  };
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await removeCourse(course._id);

    if (res.error) {
      alert(res.error);
      return;
    }

    alert("Курс удалён");
  };
  const getContinueText = (progress: number) => {
    if (progress === 0) return "Начать тренировки";
    if (progress === 100) return "Начать заново";
    return "Продолжить";
  };
  return (
    <>
      <Link href={`/course/${course._id}`}>
        <div className={styles.card}>
          <Image
            className={styles.image}
            width={360}
            height={325}
            src={image}
            alt="profile"
          ></Image>
          <div className={styles.desc_card}>
            <h3 className={styles.title}>{course.nameRU}</h3>
            <div className={styles.block}>
              <div className={styles.information}>
                <Image
                  className={styles.icon}
                  width={18}
                  height={18}
                  src="/icon/Icon.svg"
                  alt="profile"
                ></Image>
                <p className={styles.icon_text}>{course.durationInDays} дней</p>
              </div>
              <div className={styles.information}>
                <Image
                  className={styles.icon}
                  width={18}
                  height={18}
                  src="/icon/Icon (1).svg"
                  alt="profile"
                ></Image>
                <p className={styles.icon_text}>
                  {course.dailyDurationInMinutes.from} -{" "}
                  {course.dailyDurationInMinutes.to} мин/день
                </p>
              </div>
            </div>
            <div className={styles.information}>
              <Image
                className={styles.icon}
                width={18}
                height={18}
                src="/icon/Group.svg"
                alt="profile"
              ></Image>
              <p className={styles.icon_text}>{course.difficulty}</p>
            </div>
            {variant === "profile" && (
              <div className={styles.progress}>
                <p className={styles.progressText}>Прогресс {progress}%</p>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {variant === "profile" && (
              <button className={styles.continueBtn} onClick={handleContinue}>
                {getContinueText(progress)}
              </button>
            )}
          </div>

          {variant === "default" && (
            <Image
              className={styles.more}
              width={32}
              height={32}
              src="/icon/Add-in-Circle.svg"
              alt="more"
              onClick={handleAddCourse}
              style={{ cursor: "pointer" }}
            />
          )}
          {variant === "profile" && (
            <Image
              className={styles.more}
              width={32}
              height={32}
              src="/remove.svg"
              alt="remove"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove?.(course._id);
              }}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </Link>
      <WorkoutSelectModal
        isOpen={isModalOpen}
        workouts={workouts}
        completedWorkouts={workoutsProgress}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectWorkout}
      />
    </>
  );
}
