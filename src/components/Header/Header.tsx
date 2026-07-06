"use client";
import Image from "next/image";
import styles from "./Header.module.css";
import { useEffect, useState } from "react";
import AuthModal from "../AuthModal/AuthModal";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { getMe, logout } from "@/services/auth.service";

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      setIsAuth(true);

      try {
        const user = await getMe();

        setUserEmail(user.user.email);
      } catch (error) {
        setIsAuth(false);
        localStorage.removeItem("token");
      }
    };

    loadUser();
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.header__wrapper}>
          <div className={styles.logoBlock}>
            <Image src="/icon/logo.svg" alt="Logo" width={220} height={35} />
            {!isAuth && (
              <p className={styles.logo_text}>
                Онлайн-тренировки для занятий дома
              </p>
            )}
          </div>

          <div className={styles.auth}>
            {isAuth ? (
              <button className={styles.profile_btn}>
                <Image
                  width={50}
                  height={50}
                  src="/icon/profile.svg"
                  alt="profile"
                />
                <div
                  className={styles.profile_wrapper}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                >
                  <p className={styles.profile_name}>Сергей</p>
                  <Image
                    src="/icon/open.svg"
                    alt="стрелка"
                    width={13}
                    height={8}
                  ></Image>
                </div>
              </button>
            ) : (
              <button
                className={styles.login_btn}
                onClick={() => setIsModalOpen(true)}
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ProfileMenu
        isOpen={isProfileOpen}
        email={userEmail}
        onClose={() => setIsProfileOpen(false)}
        onProfile={() => {
          setIsProfileOpen(false);
          // позже здесь будет router.push("/profile")
        }}
        onLogout={() => {
          logout();
          setIsProfileOpen(false);
          window.location.reload();
        }}
      />
    </>
  );
}
