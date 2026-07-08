"use client";

import Image from "next/image";
import styles from "./SuccessModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SuccessModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Ваш прогресс засчитан</h2>

        <button onClick={onClose}>
          <Image
            className={styles.icon}
            width={57}
            height={57}
            src="/icon/prClose.svg"
            alt="закрыть"
          ></Image>
        </button>
      </div>
    </div>
  );
}
