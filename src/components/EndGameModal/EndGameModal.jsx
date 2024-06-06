import React, { useState, useEffect } from "react";
import styles from "./EndGameModal.module.css";
import { Button } from "../Button/Button";
import deadImageUrl from "./images/dead.png";
import celebrationImageUrl from "./images/celebration.png";
import { Link } from "react-router-dom";

export function EndGameModal({ isWon, gameDurationSeconds, gameDurationMinutes, onClick, threeMistakesMode }) {
  const title = isWon ? "Вы победили!" : "Вы проиграли!";
  const imgSrc = isWon ? celebrationImageUrl : deadImageUrl;
  const imgAlt = isWon ? "celebration emodji" : "dead emodji";

  const [isLeaderboard, setIsLeaderboard] = useState(false);
  const [name, setName] = useState("");

  const totalTime = gameDurationMinutes * 60 + gameDurationSeconds;

  useEffect(() => {
    if (isWon && !threeMistakesMode) {
      fetch("https://wedev-api.sky.pro/api/leaderboard")
        .then(response => response.json())
        .then(data => {
          const leaders = data.leaders;
          if (leaders.length < 10 || totalTime < leaders[leaders.length - 1].time) {
            setIsLeaderboard(true);
          }
        })
        .catch(error => console.error("Error fetching leaderboard:", error));
    }
  }, [isWon, totalTime, threeMistakesMode]);

  const handleSubmit = event => {
    event.preventDefault();
    const playerName = name || "Пользователь";

    fetch("https://wedev-api.sky.pro/api/leaderboard", {
      method: "POST",
      body: JSON.stringify({ name: playerName, time: totalTime }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            console.error("Error response:", err);
            throw new Error(`HTTP error! status: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setIsLeaderboard(false);
        onClick();
      })
      .catch(error => console.error("Error adding to leaderboard:", error));
  };

  return (
    <div className={styles.modal}>
      <img className={styles.image} src={imgSrc} alt={imgAlt} />
      {isWon && isLeaderboard ? (
        <div className={styles.leaderboardModal}>
          <h2 className={styles.title}>Вы попали на Лидерборд!</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Пользователь"
              className={styles.input}
            />
            <p className={styles.description}>Затраченное время:</p>
            <div className={styles.time}>
              {gameDurationMinutes.toString().padStart(2, "0")}:{gameDurationSeconds.toString().padStart(2, "0")}
            </div>
            <Button type="submit" className={styles.button}>
              Играть снова
            </Button>
          </form>
          <Link to="/leaderboard" className={styles.link}>
            Перейти к лидерборду
          </Link>
        </div>
      ) : (
        <>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>Затраченное время:</p>
          <div className={styles.time}>
            {gameDurationMinutes.toString().padStart(2, "0")}:{gameDurationSeconds.toString().padStart(2, "0")}
          </div>
          <Button onClick={onClick} className={styles.button}>
            Начать сначала
          </Button>
        </>
      )}
    </div>
  );
}
