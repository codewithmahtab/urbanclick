import styles from "./loader.module.css";

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}>
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>

        <div className={styles.base}>
          <span></span>
          <div className={styles.face}></div>
        </div>
      </div>

      <div className={styles.longfazers}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}