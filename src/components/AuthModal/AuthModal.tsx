"use client";

import { useState } from "react";
import styles from "./AuthModal.module.css";
import Image from "next/image";
import classNames from "classnames";
import { login, register } from "@/services/auth.service";
import { AxiosError } from "axios";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      await login(email, password);

      onClose();
      window.location.reload();
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || "Ошибка входа");
      } else {
        setError("Ошибка входа");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      await register(email, password);
      await login(email, password);

      onClose();
      window.location.reload();
    } catch (e) {
      if (e instanceof AxiosError) {
        setError(e.response?.data?.message || "Ошибка регистрации");
   
      } else {
        setError("Ошибка регистрации");
      }
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Image
          className={styles.image}
          src="/icon/logo.svg"
          alt="Logo"
          width={220}
          height={35}
        />
        <div className={styles.input_wrapper}>
          <input
            className={styles.input}
            type="email"
            placeholder="Логин"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttons}>
          <button
            onClick={handleLogin}
            disabled={loading}
            className={classNames(styles.button, styles.primary)}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
          <button
            onClick={handleRegister}
            disabled={loading}
            className={classNames(styles.button, styles.secondary)}
          >
            Зарегистрироваться
          </button>
        </div>

        <button className={styles.close} onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
