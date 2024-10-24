import React from "react";
import styles from "./StandardHeader.module.css";
import { useRouter } from "next/router";
import { useTelegram } from "../../utils/twa";

export interface StandardHeaderProps {
  title: string;
  backButtonNavigateTo: string;
  backButtonHide?: boolean;
}

const StandardHeader = ({
  title,
  backButtonNavigateTo,
  backButtonHide,
}: StandardHeaderProps) => {
  const router = useRouter();
  const { vibrate } = useTelegram();

  const backButtonHandler = () => {
    router.push(`${backButtonNavigateTo}`);
  };

  return (
    <div className={styles.standardHeaderContainer}>
      <div className={styles.headerContainer}>
        <div
          className={styles.backButtonContainer}
          onClick={() => {
            vibrate("light");
            backButtonHandler();
          }}
          style={{
            display: backButtonHide ? `none` : ``,
          }}
        >
          <i className={`${styles.backButton} fa-solid fa-arrow-left`}></i>
        </div>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{title}</span>
        </div>
        <div
          style={{
            display: backButtonHide ? `none` : ``,
          }}
        >
          <span className={styles.dummyContainer}>
            <i className={`fa-solid fa-arrow-right`}></i>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StandardHeader;
