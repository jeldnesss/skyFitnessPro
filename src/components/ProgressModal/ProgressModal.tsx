"use client";

import styles from "./ProgressModal.module.css";

type Exercise = {
  _id: string;
  name: string;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  exercises: Exercise[];
  values: number[];
  onChange: (index: number, value: number) => void;
  onClose: () => void;
  onSave: () => void;
};

export default function ProgressModal({
  isOpen,
  exercises,
  values,
  onChange,
  onClose,
  onSave,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Мой прогресс</h2>

        <div className={styles.list}>
          {exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.row}>
              <p className={styles.exName}>{exercise.name}</p>

              <input
                type="number"
                min={0}
                max={exercise.quantity}
                value={values[index] ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);

                  onChange(index, Number.isNaN(val) ? 0 : val);
                }}
              />
            </div>
          ))}
        </div>

        <div className={styles.buttons}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={onSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
