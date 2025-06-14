"use client";

import styles from "./page.module.css";
import ProgressBar from "./components/ProgressBar";
import UserInput from "./components/UserInput";
import Guide from "./components/Guide";

export default function Home() {
  return (
    <div className={styles.container}>
      <ProgressBar />
      <div className={styles.inputGroup}>
        <UserInput />
        <Guide />
      </div>
    </div>
  );
}
