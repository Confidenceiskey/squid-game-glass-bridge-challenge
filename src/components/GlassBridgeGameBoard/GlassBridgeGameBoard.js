import React from "react";

import GuessingSquareArea from "./components/GuessingSquareArea/GuessingSquareArea";
import Platform from "./components/Platform/Platform";

import { findSelectedGameStates, getSectionAccessState, splitBridgeInHalf } from "../../utils/gameCalculations";

import "./GlassBridgeGameBoard.css";

const GlassBridgeGameBoard = ({
  clickingNotAllowed,
  gameState,
  gameStatus,
  handleUnknownSquareClick,
  handleTileClick,
  levelPlayerIsSelectedAt,
  unlockedLevel,
}) => {
  const startPlatformState = { ...gameState[0] };
  const bridgeState = gameState.slice(1, gameState.length - 1);
  const finishPlatformState = { ...gameState[gameState.length - 1] };

  const bottomRightBridgeState = splitBridgeInHalf(bridgeState, "bottomRightSquares");
  const leftTopBridgeState = splitBridgeInHalf(bridgeState, "leftTopSquares");

  const { selectedTileLevel } = findSelectedGameStates(gameState, null, unlockedLevel);
  const startPlatformAccess = getSectionAccessState(unlockedLevel, startPlatformState.level);
  const restrictStartPlatformAccess = selectedTileLevel > 0 || unlockedLevel < 0 ? "locked" : "";
  const finishPlatformAccess = getSectionAccessState(unlockedLevel, finishPlatformState.level);

  return (
    <div className="game-board-wrapper">
      <div className={`platform platform-start ${startPlatformAccess}`}>
        <Platform
          gameStatus={gameStatus}
          handleTileClick={handleTileClick}
          platformState={startPlatformState}
          platformAccess={restrictStartPlatformAccess}
        />
      </div>
      <div className="platform-support-start" />
      <div className="guessing-squares-container container-left-top">
        {leftTopBridgeState.map(({ level, square }) => (
          <GuessingSquareArea
            clickingNotAllowed={clickingNotAllowed}
            handleTileClick={handleTileClick}
            handleUnknownSquareClick={handleUnknownSquareClick}
            key={`${level}LT`}
            level={level}
            levelPlayerIsSelectedAt={levelPlayerIsSelectedAt}
            clickIsInAllowableArea={selectedTileLevel ? level === selectedTileLevel + 1 : true}
            square={square}
            unlockedLevel={unlockedLevel}
          />
        ))}
      </div>
      <div className="center-beam"></div>
      <div className="guessing-squares-container container-bottom-right">
        {bottomRightBridgeState.map(({ level, square }) => (
          <GuessingSquareArea
            clickingNotAllowed={clickingNotAllowed}
            handleTileClick={handleTileClick}
            handleUnknownSquareClick={handleUnknownSquareClick}
            key={`${level}BR`}
            level={level}
            levelPlayerIsSelectedAt={levelPlayerIsSelectedAt}
            clickIsInAllowableArea={selectedTileLevel ? level === selectedTileLevel + 1 : true}
            square={square}
            unlockedLevel={unlockedLevel}
          />
        ))}
      </div>
      <div className="platform-support-end" />
      <div className={`platform platform-end ${finishPlatformAccess}`}>
        <Platform
          gameStatus={gameStatus}
          handleTileClick={handleTileClick}
          levelPlayerIsSelectedAt={levelPlayerIsSelectedAt}
          platformState={finishPlatformState}
          platformAccess={finishPlatformAccess}
        />
      </div>
    </div>
  );
};

export default GlassBridgeGameBoard;
