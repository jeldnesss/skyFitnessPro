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
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Заполнить прогресс</h2>

        {exercises.map((exercise, index) => (
          <div key={exercise._id} className={styles.row}>
            <p className={styles.exName}>{exercise.name}</p>

            <input
              type="number"
              min={0}
              value={values[index]}
              onChange={(e) => {
                let val = Number(e.target.value);

                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;

                if (val > exercise.quantity) val = exercise.quantity;

                onChange(index, val);
              }}
            />
          </div>
        ))}

        <div className={styles.buttons}>
          <button onClick={onClose}>Отмена</button>
          <button onClick={onSave}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
