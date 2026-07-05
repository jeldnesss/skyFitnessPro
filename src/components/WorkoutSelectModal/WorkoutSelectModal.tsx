"use client";

import { useState } from "react";
import styles from "./WorkoutSelectModal.module.css";

export type Workout = {
  _id: string;
  name: string;
};

type Props = {
  isOpen: boolean;
  workouts: Workout[];
  onClose: () => void;
  onSelect: (workoutId: string) => void;
};

export default function WorkoutSelectModal({
  isOpen,
  workouts,
  onClose,
  onSelect,
}: Props) {
  const [selectedWorkout, setSelectedWorkout] = useState("");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Выберите тренировку</h3>

        {workouts.length === 0 ? (
          <p>Нет тренировок</p>
        ) : (
          <div className={styles.list}>
            {workouts.map((workout) => (
              <label key={workout._id} className={styles.item}>
                <input
                  type="radio"
                  name="workout"
                  className={styles.radio}
                  checked={selectedWorkout === workout._id}
                  onChange={() => setSelectedWorkout(workout._id)}
                />

                <div className={styles.circle} />

                <span className={styles.name}>{workout.name}</span>
              </label>
            ))}
          </div>
        )}

        <button
          className={styles.startBtn}
          disabled={!selectedWorkout}
          onClick={() => onSelect(selectedWorkout)}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
