import React, { useEffect, useState } from "react";

import "./Timer.css";

const Timer = ({
  isTimerRunning,
  gameStatus,
  resetOrStartGame,
  resetTimer,
  setClickingNotAllowed,
  setEndGameText,
  setGameStatus,
  setIsTimerRunning,
  setUnlockedLevel,
}) => {
  const [countdownTimer, setCountdownTimer] = useState(60);
  const [showTooltipOnClick, setShowTooltipOnClick] = useState(false);

  const disableButton = gameStatus === "in progress";
  const countdownButtonText = gameStatus === "game over" ? "RESET" : "START";

  useEffect(() => {
    let secondInterval = null;
    if (resetTimer) {
      setCountdownTimer(60);
    }

    if (gameStatus === "in progress") {
      setShowTooltipOnClick(false);
    }

    if (isTimerRunning && countdownTimer > 0) {
      secondInterval = setInterval(() => {
        setCountdownTimer((previousCountdownTimer) => previousCountdownTimer - 1);
      }, 1000);
    } else if (isTimerRunning && countdownTimer === 0) {
      setIsTimerRunning(false);
      setUnlockedLevel(-1);
      setClickingNotAllowed(true);
      setGameStatus("game over");
      setEndGameText("You lose!");
      clearInterval(secondInterval);
    }
    return () => clearInterval(secondInterval);
  }, [
    isTimerRunning,
    countdownTimer,
    gameStatus,
    resetTimer,
    setEndGameText,
    setIsTimerRunning,
    setUnlockedLevel,
    setClickingNotAllowed,
    setGameStatus,
  ]);

  const handleClick = () => {
    setShowTooltipOnClick((previousShowTooltipOnClick) => !previousShowTooltipOnClick);
  };

  const showTooltip = showTooltipOnClick ? 'show-tooltip' : 'hide-tooltip';

  return (
    <div className="timer-container">
      <span className="countdown-timer">{countdownTimer}</span>
      <div className="button-wrapper">
        <button
          className={`button ${disableButton ? "disabled" : ""}`}
          disabled={disableButton}
          onClick={(e) => resetOrStartGame(e)}
          type="button"
        >
          {countdownButtonText}
        </button>
        <button className={`button tooltip `} onClick={() => handleClick()} type="button">
          RULES
          <div className={`tooltip-text ${showTooltip}`}>
            <div className="tooltip-title">Instructions:</div>
            <div className="text">1. Select a player (number) on the starting platform</div>
            <div className="text">2. Pick a square on the bridge</div>
            <div className="text">3. Get 5 players to the finish platform before time runs out to win.</div>
            <div className="text">
              Note: You must select a player to be able to move & you can only move 1 player at a time.
            </div>
            <div className="text">
              (PS - Curious to see how I built this? Check out my cool time lapse video showing {" "}
              <a href="https://youtu.be/elugaR4pkn8">How I made the Glass Bridge Challenge from Squid Game</a>)
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Timer;
