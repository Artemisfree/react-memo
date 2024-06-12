import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LeaderboardPage.module.css";
import magicBallColor from "./images/magic_ball.png";
import magicBallGrey from "./images/magic_ball_grey.png";
import frame18407Color from "./images/frame_18407.png";
import frame18407Grey from "./images/frame_18407_grey.png";

export const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("https://wedev-api.sky.pro/api/v2/leaderboard")
      .then(response => response.json())
      .then(data => {
        const sortedLeaders = data.leaders.sort((a, b) => a.time - b.time);
        setLeaders(sortedLeaders);
      })
      .catch(error => console.error("Error fetching leaderboard:", error));
  }, []);

  const getAchievementIcon = (leader, achievement) => {
    if (achievement === 1) {
      return leader.achievements.includes(1) ? magicBallColor : magicBallGrey;
    } else if (achievement === 2) {
      return leader.achievements.includes(2) ? frame18407Color : frame18407Grey;
    }
    return null;
  };

  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

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
          <span>Достижения</span>
          <span>Время</span>
        </div>
        {leaders.map((leader, index) => (
          <div key={leader.id} className={styles.row}>
            <span>#{index + 1}</span>
            <span>{leader.name}</span>
            <span className={styles.achievementsContainer}>
              <img src={getAchievementIcon(leader, 2)} alt="Hard Mode Achievement" className={styles.achievementIcon} />
              <img
                src={getAchievementIcon(leader, 1)}
                alt="Magic Ball Achievement"
                className={styles.achievementIcon}
              />
            </span>
            <span className={styles.timeFormatted}>{formatTime(leader.time)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
