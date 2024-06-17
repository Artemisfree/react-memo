import React from "react";
import styles from "./SuperPowerModal.module.css";

export function SuperPowerModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalWrapper}>
        <div className={styles.modal}>
          <h3 className={styles.title}>Прозрение</h3>
          <p className={styles.description}>
            На 5 секунд <br />
            показываются все <br />
            карты. Таймер <br />
            длительности игры <br />
            на это время <br />
            останавливается.
          </p>
        </div>
      </div>
    </div>
  );
}
