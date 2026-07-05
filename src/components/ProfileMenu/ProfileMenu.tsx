"use client";

import Link from "next/link";
import styles from "./ProfileMenu.module.css";

type Props = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
};

export default function ProfileMenu({
  isOpen,
  email,
  onClose,
  onProfile,
  onLogout,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.menu}>
        <div className={styles.profile_names}>
          <p className={styles.name}>Сергей</p>
          <p className={styles.email}>{email}</p>
        </div>
        <div className={styles.button_wrapper}>
          <Link href="/profile">
            <button className={styles.button} onClick={onProfile}>
              Мой профиль
            </button>
          </Link>

          <button className={styles.logout} onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>
    </>
  );
}
