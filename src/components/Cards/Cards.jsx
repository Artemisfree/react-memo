import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { generateDeck } from "../../utils/cards";
import styles from "./Cards.module.css";
import { EndGameModal } from "../../components/EndGameModal/EndGameModal";
import { Button } from "../../components/Button/Button";
import { Card } from "../../components/Card/Card";
import superPowerImage from "./images/eye.png";
import { Link } from "react-router-dom";
import { SuperPowerModal } from "../SuperPower/SuperPowerModal";

const STATUS_LOST = "STATUS_LOST";
const STATUS_WON = "STATUS_WON";
const STATUS_IN_PROGRESS = "STATUS_IN_PROGRESS";
const STATUS_PREVIEW = "STATUS_PREVIEW";

function getTimerValue(startDate, endDate) {
  if (!startDate && !endDate) {
    return {
      minutes: 0,
      seconds: 0,
    };
  }

  if (endDate === null) {
    endDate = new Date();
  }

  const diffInSecconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
  const minutes = Math.floor(diffInSecconds / 60);
  const seconds = diffInSecconds % 60;
  return {
    minutes,
    seconds,
  };
}

export function Cards({ pairsCount = 3, previewSeconds = 5, threeMistakesMode = false }) {
  const [cards, setCards] = useState([]);
  const [status, setStatus] = useState(STATUS_PREVIEW);
  const [mistakes, setMistakes] = useState(0);
  const [gameStartDate, setGameStartDate] = useState(null);
  const [gameEndDate, setGameEndDate] = useState(null);
  const [timer, setTimer] = useState({
    seconds: 0,
    minutes: 0,
  });

  const [superPowerUsed, setSuperPowerUsed] = useState(false);
  const [superPowerActive, setSuperPowerActive] = useState(false);
  const [showSuperPowerModal, setShowSuperPowerModal] = useState(false);

  function finishGame(status = STATUS_LOST) {
    setGameEndDate(new Date());
    setStatus(status);
  }

  function startGame() {
    const startDate = new Date();
    setGameEndDate(null);
    setGameStartDate(startDate);
    setTimer(getTimerValue(startDate, null));
    setStatus(STATUS_IN_PROGRESS);
  }

  function resetGame() {
    setGameStartDate(null);
    setGameEndDate(null);
    setTimer(getTimerValue(null, null));
    setStatus(STATUS_PREVIEW);
    setMistakes(0);
    setSuperPowerUsed(false);
    setSuperPowerActive(false);
  }

  const openCard = clickedCard => {
    if (clickedCard.open) {
      return;
    }
    const nextCards = cards.map(card => {
      if (card.id !== clickedCard.id) {
        return card;
      }
      return {
        ...card,
        open: true,
      };
    });

    setCards(nextCards);

    const isPlayerWon = nextCards.every(card => card.open);

    if (isPlayerWon) {
      finishGame(STATUS_WON);
      return;
    }

    const openCards = nextCards.filter(card => card.open);

    const openCardsWithoutPair = openCards.filter(card => {
      const sameCards = openCards.filter(openCard => card.suit === openCard.suit && card.rank === openCard.rank);
      if (sameCards.length < 2) {
        return true;
      }
      return false;
    });

    const playerLost = openCardsWithoutPair.length >= 2;

    if (playerLost) {
      if (threeMistakesMode) {
        setMistakes(mistakes + 1);
        if (mistakes + 1 >= 3) {
          finishGame(STATUS_LOST);
        }
      } else {
        finishGame(STATUS_LOST);
      }
      return;
    }
  };

  const isGameEnded = status === STATUS_LOST || status === STATUS_WON;

  useEffect(() => {
    if (status !== STATUS_PREVIEW) {
      return;
    }

    if (pairsCount > 36) {
      alert("Столько пар сделать невозможно");
      return;
    }

    setCards(() => {
      return shuffle(generateDeck(pairsCount, 10));
    });

    const timerId = setTimeout(() => {
      startGame();
    }, previewSeconds * 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [status, pairsCount, previewSeconds]);

  useEffect(() => {
    if (superPowerActive) {
      const superPowerTimer = setTimeout(() => {
        setSuperPowerActive(false);
        setGameStartDate(prevDate => new Date(prevDate.getTime() + 5000));
      }, 5000);
      return () => {
        clearTimeout(superPowerTimer);
      };
    }

    const intervalId = setInterval(() => {
      setTimer(getTimerValue(gameStartDate, gameEndDate));
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [gameStartDate, gameEndDate, superPowerActive]);

  const handleMouseEnter = () => {
    setShowSuperPowerModal(true);
  };

  const handleMouseLeave = () => {
    setShowSuperPowerModal(false);
  };

  const useSuperPower = () => {
    if (!superPowerUsed && status === STATUS_IN_PROGRESS) {
      setSuperPowerActive(true);
      setSuperPowerUsed(true);
      setShowSuperPowerModal(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.timer}>
          {status === STATUS_PREVIEW ? (
            <div>
              <p className={styles.previewText}>Запоминайте пары!</p>
              <p className={styles.previewDescription}>Игра начнется через {previewSeconds} секунд</p>
            </div>
          ) : (
            <>
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>min</div>
                <div>{timer.minutes.toString().padStart("2", "0")}</div>
              </div>
              .
              <div className={styles.timerValue}>
                <div className={styles.timerDescription}>sec</div>
                <div>{timer.seconds.toString().padStart("2", "0")}</div>
              </div>
            </>
          )}
        </div>
        {status === STATUS_IN_PROGRESS && !superPowerUsed ? (
          <Link
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={useSuperPower}
            className={styles.superPowerButton}
          >
            <img src={superPowerImage} alt="Прозрение" className={styles.superPowerImage} />
          </Link>
        ) : null}
        {status === STATUS_IN_PROGRESS ? <Button onClick={resetGame}>Начать заново</Button> : null}
      </div>

      <div className={styles.cards}>
        {cards.map(card => (
          <Card
            key={card.id}
            onClick={() => openCard(card)}
            open={status !== STATUS_IN_PROGRESS || superPowerActive ? true : card.open}
            suit={card.suit}
            rank={card.rank}
          />
        ))}
      </div>
      {threeMistakesMode && status === STATUS_IN_PROGRESS ? (
        <div className={styles.mistakes}>Осталось {3 - mistakes} попытки</div>
      ) : null}
      {isGameEnded ? (
        <div className={styles.modalContainer}>
          <EndGameModal
            isWon={status === STATUS_WON}
            gameDurationSeconds={timer.seconds}
            gameDurationMinutes={timer.minutes}
            onClick={resetGame}
            threeMistakesMode={threeMistakesMode}
          />
        </div>
      ) : null}
      {showSuperPowerModal && <SuperPowerModal onClose={handleMouseLeave} />}
    </div>
  );
}
