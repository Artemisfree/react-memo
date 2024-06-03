import { Link } from "react-router-dom";
import React, { useState } from "react";
import styles from "./SelectLevelPage.module.css";

export function SelectLevelPage() {
  const [threeMistakesMode, setThreeMistakesMode] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <h1 className={styles.title}>Выбери сложность</h1>
        <ul className={styles.levels}>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/3?threeMistakesMode=${threeMistakesMode}`}>
              1
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/6?threeMistakesMode=${threeMistakesMode}`}>
              2
            </Link>
          </li>
          <li className={styles.level}>
            <Link className={styles.levelLink} to={`/game/9?threeMistakesMode=${threeMistakesMode}`}>
              3
            </Link>
          </li>
        </ul>
        <div className={styles.checkboxContainer}>
          <label>
            <input type="checkbox" checked={threeMistakesMode} onChange={e => setThreeMistakesMode(e.target.checked)} />
            Режим трех ошибок
          </label>
        </div>
      </div>
    </div>
  );
}
