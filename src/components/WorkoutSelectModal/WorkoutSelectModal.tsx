"use client";
import styles from "./WorkoutSelectModal.module.css";
import { WorkoutProgress } from "@/types/course";
export type Workout = {
  _id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  workouts: Workout[];
  completedWorkouts: WorkoutProgress[];
  onClose: () => void;
  onSelect: (workoutId: string) => void;
};

export default function WorkoutSelectModal({
  isOpen,
  workouts,
  completedWorkouts,
  onClose,
  onSelect,
}: Props) {
  if (!isOpen) return null;
  const nextWorkout = workouts.find((workout) => {
    const progress = completedWorkouts.find(
      (item) => item.workoutId === workout._id,
    );

    return !progress?.workoutCompleted;
  });

  const workoutToStart = nextWorkout ?? workouts[0];
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Выберите тренировку</h3>

        {workouts.length === 0 ? (
          <p>Нет тренировок</p>
        ) : (
          <div className={styles.list}>
            {[...workouts]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((workout) => {
                const completed = completedWorkouts.some(
                  (item) =>
                    item.workoutId === workout._id && item.workoutCompleted,
                );

                return (
                  <div
                    key={workout._id}
                    className={styles.item}
                    onClick={() => onSelect(workout._id)}
                  >
                    {completed && <div className={styles.check}></div>}
                    {!completed && <div className={styles.notCheck}></div>}
                    <span className={styles.name}>{workout.name}</span>
                  </div>
                );
              })}
          </div>
        )}

        <button
          className={styles.startBtn}
          disabled={workouts.length === 0}
          onClick={() => {
            if (workoutToStart) {
              onSelect(workoutToStart._id);
            }
          }}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
