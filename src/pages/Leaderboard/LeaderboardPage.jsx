import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LeaderboardPage.module.css";

export const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("https://wedev-api.sky.pro/api/leaderboard")
      .then(response => response.json())
      .then(data => {
        const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time);
        setLeaders(sortedLeaders);
      })
      .catch(error => console.error("Error fetching leaderboard:", error));
  }, []);

  return (
    <div className={styles.leaderboardPage}>
      <div className={styles.header}>
        <h1>Лидерборд</h1>
        <Link to="/" className={styles.startGameButton}>
          Начать игру
        </Link>
      </div>
      <div className={styles.leaderboard}>
        <div className={styles.rowHeader}>
          <span>Позиция</span>
          <span>Пользователь</span>
          <span>Время</span>
        </div>
        {leaders.map((leader, index) => (
          <div key={leader.id} className={styles.row}>
            <span>#{index + 1}</span>
            <span>{leader.name}</span>
            <span>{leader.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
