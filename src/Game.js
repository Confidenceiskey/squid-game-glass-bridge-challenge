import React, { useEffect, useState } from "react";
import EndGameModal from './components/EndGameModal/EndGameModal';
import Footer from "./components/Footer/Footer";
import GlassBridgeGameBoard from "./components/GlassBridgeGameBoard/GlassBridgeGameBoard";
import Header from "./components/Header/Header";
import Timer from "./components/Timer/Timer";

import {
  advancePlayerToNextLevel,
  changeSquareStatusTo,
  findSelectedGameStates,
  findSelectedPlayer,
  generateCorrectPath,
  kill,
  movePlayerToSelectedTile,
  removePlayerFromGameBoard,
  reverseTileSelection,
  scrollToStart,
  startTimer,
  unlockNextLevel,
} from "./utils/gameCalculations";
import { initialGameState, initialStatusOfPlayers } from "./utils/gameStates";

import "./Game.css";

function Game() {
  const [gameStatus, setGameStatus] = useState("not playing");
  const [endGameText, setEndGameText] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [correctPath, setCorrectPath] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(-1);
  const [gameState, setGameState] = useState(initialGameState);
  const [clickingNotAllowed, setClickingNotAllowed] = useState(false);
  const [statusOfPlayers, setStatusOfPlayers] = useState(initialStatusOfPlayers);
  const [playersAtFinish, setPlayersAtFinish] = useState(0);
  const [playersAliveCount, setPlayersAliveCount] = useState(9);
  const [levelPlayerIsSelectedAt, setLevelPlayerIsSelectedAt] = useState(null);

  const resetOrStartGame = (e) => {
    if (gameStatus !== "in progress") {
      e.target.textContent.toLowerCase() === "start" ? startGame() : resetGame();
    }

    // Otherwise game is "in progress" and we just want to return nothing
    return null;
  };

  const resetGame = () => {
    setGameStatus("not playing");
    setCorrectPath(null);
    setResetTimer(true);
    setGameState(initialGameState);
    setPlayersAliveCount(9);
    setPlayersAtFinish(0);
    setStatusOfPlayers(initialStatusOfPlayers);
    setLevelPlayerIsSelectedAt(null);
    scrollToStart();
  };

  const startGame = () => {
    setGameStatus("in progress");
    setCorrectPath(generateCorrectPath());
    unlockNextLevel(setUnlockedLevel);
    setResetTimer(false);
    startTimer(setIsTimerRunning);
    scrollToStart();
  };

  useEffect(() => {
    if (playersAliveCount < 5) {
      setIsTimerRunning(false);
      setUnlockedLevel(-1);
      setClickingNotAllowed(true);
      setGameStatus("game over");
      setEndGameText("You lose!");
    }

    if (playersAtFinish > 4) {
      setIsTimerRunning(false);
      setUnlockedLevel(-1);
      setClickingNotAllowed(true);
      setGameStatus("game over");
      setEndGameText("You win!");
    }
  }, [playersAliveCount, playersAtFinish]);

  const handleTileClick = (clickLevel, tileIndexNumber, tileValue) => {
    if (clickLevel > unlockedLevel || tileValue === -1) {
      return;
    }

    const determineUserMove = () => {
      const { isAnyTileSelected, isSameTileClicked, selected, selectedTileLevel } = findSelectedGameStates(
        gameState,
        tileValue,
        unlockedLevel
      );

      if (!isAnyTileSelected && tileValue !== null && clickLevel < 6) {
        if (unlockedLevel === clickLevel) {
          unlockNextLevel(setUnlockedLevel);
        }

        reverseTileSelection(clickLevel, gameState, setGameState, tileIndexNumber);
        setClickingNotAllowed(false);
        setLevelPlayerIsSelectedAt(clickLevel);
        return "select";
      }

      if (isAnyTileSelected && isSameTileClicked && selected[0].level === clickLevel) {
        reverseTileSelection(clickLevel, gameState, setGameState, tileIndexNumber);
        setClickingNotAllowed(true);
        setLevelPlayerIsSelectedAt(null);
        return "deselect";
      }

      if (selectedTileLevel >= 0 && clickLevel === selectedTileLevel + 1 && isAnyTileSelected && tileValue === null) {
        const selectedLevel = selected[0].level;
        const selectedPlayerInfo = findSelectedPlayer(gameState, clickLevel);
        movePlayerToSelectedTile(clickLevel, selectedPlayerInfo, selectedLevel, setGameState, tileIndexNumber);
        setLevelPlayerIsSelectedAt(null);
        setClickingNotAllowed(true);

        if (clickLevel === 6) {
          setPlayersAtFinish((previousPlayersAtFinish) => previousPlayersAtFinish + 1)
        }
        return "valid";
      }

      if ((isAnyTileSelected && !isSameTileClicked) || selectedTileLevel === null) {
        return "invalid";
      }
    };
    determineUserMove();
  };

  const handleUnknownSquareClick = (level, position) => {
    if (clickingNotAllowed || level > unlockedLevel || level - levelPlayerIsSelectedAt !== 1) {
      // no clicking allowed!
      return;
    }
    setLevelPlayerIsSelectedAt(null);
    setClickingNotAllowed(true);

    const selectedPlayer = findSelectedPlayer(gameState, level);
    const { selectedPlayerNumber, selectedTileIndex } = selectedPlayer;

    if (`${level}${position}` === correctPath[level - 1]) {
      // User guessed correctly!
      setTimeout(() => {
        changeSquareStatusTo(gameState, level, position, setGameState, "occupied");
        advancePlayerToNextLevel(level, position, selectedPlayer, setGameState);
      }, 850);
    } else {
      // User guessed incorrectly!
      setTimeout(() => {
        changeSquareStatusTo(gameState, level, position, setGameState, "incorrect");
        kill(selectedPlayerNumber, setStatusOfPlayers, statusOfPlayers);
        removePlayerFromGameBoard(level, selectedTileIndex, setGameState, setPlayersAliveCount);
      }, 750);
    }
  };

  return (
    <div className="squid-game">
      <Header />
      <Timer
        isTimerRunning={isTimerRunning}
        gameStatus={gameStatus}
        resetOrStartGame={resetOrStartGame}
        resetTimer={resetTimer}
        setClickingNotAllowed={setClickingNotAllowed}
        setGameStatus={setGameStatus}
        setEndGameText={setEndGameText}
        setIsTimerRunning={setIsTimerRunning}
        setUnlockedLevel={setUnlockedLevel}
      />
      <GlassBridgeGameBoard
        clickingNotAllowed={clickingNotAllowed}
        gameState={gameState}
        gameStatus={gameStatus}
        handleUnknownSquareClick={handleUnknownSquareClick}
        handleTileClick={handleTileClick}
        levelPlayerIsSelectedAt={levelPlayerIsSelectedAt}
        unlockedLevel={unlockedLevel}
      />
      <Footer statusOfPlayers={statusOfPlayers} playersAliveCount={playersAliveCount} />
      {gameStatus === "game over" ? <EndGameModal endGameText={endGameText} /> : null}
    </div>
  );
}

export default Game;
