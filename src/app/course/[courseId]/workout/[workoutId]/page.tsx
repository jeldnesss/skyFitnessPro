"use client";
import { getCourseById } from "@/services/courses.service";
import { CourseDetails } from "@/types/course";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  getCourseWorkouts,
  getWorkoutById,
  saveWorkoutProgress,
} from "@/services/workouts.service";

import styles from "./page.module.css";
import ProgressModal from "@/components/ProgressModal/ProgressModal";
import { getWorkoutProgress } from "@/services/progress.service";
import SuccessModal from "@/components/SuccessModal/SuccessModal";

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

export default function WorkoutPage() {
  const { courseId, workoutId } = useParams<{
    courseId: string;
    workoutId: string;
  }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workoutNumber, setWorkoutNumber] = useState<number>(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [progressInputs, setProgressInputs] = useState<number[]>([]);
  useEffect(() => {
    const load = async () => {
      if (!workoutId) {
        setLoading(false);
        return;
      }

      try {
        const workoutData = await getWorkoutById(workoutId);

        if (!workoutData || !Array.isArray(workoutData.exercises)) {
          setWorkout(null);
          setLoading(false);
          return;
        }
   
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        const workouts = await getCourseWorkouts(courseId);

        const index = workouts.findIndex((w) => w._id === workoutId);

        if (index !== -1) {
          setWorkoutNumber(index + 1);
        }

        setWorkout(workoutData);
        try {
          const progressData = await getWorkoutProgress(courseId, workoutId);

          setProgress(progressData?.progressData ?? []);
          setProgressInputs(progressData?.progressData ?? []);
        } catch {
          const empty = new Array(workoutData.exercises?.length ?? 0).fill(0);

          setProgress(empty);
          setProgressInputs(empty);
        }
      } catch (e) {
       
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [workoutId, courseId]);

  if (loading) return <p>Загрузка...</p>;
  if (!workout) return <p>Урок не найден</p>;
  const handleSave = async () => {
    try {
      await saveWorkoutProgress(courseId, workoutId, progressInputs);

      setProgress(progressInputs);

      setIsModalOpen(false);

      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
  
      alert("Ошибка сохранения");
    }
  };
  return (
    <>
      <main className={styles.main}>
        <h1 className={styles.courseTitle}>{course?.nameRU}</h1>
        <div className={styles.videoBlock}>
          <iframe
            className={styles.video}
            src={workout.video}
            allowFullScreen
          />
        </div>

        <div className={styles.exercises_block}>
          <h2 className={styles.workoutTitle}>
            Упражнения тренировки {workoutNumber}
          </h2>

          <div className={styles.list}>
            {Array.isArray(workout.exercises) &&
            workout.exercises.length > 0 ? (
              workout.exercises.map((ex, index) => {
                const value = progress[index] ?? 0;
                const max = ex.quantity;

                const rawPercent =
                  max > 0 ? Math.round((value / max) * 100) : 0;

                const percent = Math.min(rawPercent, 100);

                return (
                  <div key={ex._id} className={styles.item}>
                    <div className={styles.item_box}>
                      <div>
                        <p>{ex.name.replace(/\s*\(\d+\s*повторений\)/, "")}</p>
                      </div>

                      <div className={styles.percent}>{percent}%</div>
                    </div>

                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.empty}>
                Для этой тренировки пока нет упражнений.
              </p>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={styles.button}
          >
            Заполнить свой прогресс
          </button>
        </div>
      </main>
      <ProgressModal
        isOpen={isModalOpen}
        exercises={workout.exercises}
        values={progressInputs}
        onChange={(index, value) => {
          const copy = [...progressInputs];
          copy[index] = value;
          setProgressInputs(copy);
        }}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}
