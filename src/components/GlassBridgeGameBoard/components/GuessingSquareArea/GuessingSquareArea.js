import React from "react";

import { getSectionAccessState } from "../../../../utils/gameCalculations";

import "./GuessingSquareArea.css";

const GuessingSquareArea = ({
  clickingNotAllowed,
  clickIsInAllowableArea,
  handleTileClick,
  handleUnknownSquareClick,
  level,
  levelPlayerIsSelectedAt,
  square: { location, state, status },
  unlockedLevel,
}) => {
  const levelAccess = getSectionAccessState(unlockedLevel, level);
  const position = location === "bottomRightSquares" ? "BR" : "LT";
  const direction = position === "LT" ? "top" : "bottom";

  const dynamicSquareAreaClasses = `${status === "incorrect" ? `falling-animation ${direction} ` : ""}${levelAccess}`;
  const disableCursor =
    levelAccess === "locked" || clickingNotAllowed || !clickIsInAllowableArea ? "disable-cursor" : "";
  const orderModifier = position === "BR" ? "order-first" : "";
  const isPlatformUnlocked = levelAccess !== "locked";

  const noTileSelected = state.filter((tileState) => tileState[1] === true).length === 0;

  return (
    <div className={`guessing-square-area ${dynamicSquareAreaClasses}`}>
      {status === "incorrect" ? (
        <div className="guessing-square incorrect">
          <span>X</span>
        </div>
      ) : null}
      {status === "occupied" ? (
        <div className={`guessing-square occupied ${disableCursor}`}>
          {state.map(([tileValue, selected], tileIndexNumber) => {
            const interactive =
              ((isPlatformUnlocked && noTileSelected && tileValue !== null && levelPlayerIsSelectedAt === null) ||
                (isPlatformUnlocked && selected) ||
                (levelPlayerIsSelectedAt !== null && levelPlayerIsSelectedAt + 1 === level && tileValue === null && unlockedLevel !== -1)) &&
              (clickIsInAllowableArea || selected)
                ? "interactive"
                : "";
            return (
              <div
                className={`tile ${interactive} ${selected ? "selected" : ""}`}
                key={`${level}${position}-${tileIndexNumber}`}
                onClick={() => handleTileClick(level, tileIndexNumber, tileValue)}
              >
                {tileValue !== null ? tileValue : ""}
              </div>
            );
          })}
        </div>
      ) : null}
      {status === "unknown" ? (
        <div
          className={`guessing-square unknown ${disableCursor}`}
          onClick={() => handleUnknownSquareClick(level, position)}
        >
          ?
        </div>
      ) : null}
      <div className={`guessing-square-support ${orderModifier}`}></div>
    </div>
  );
};

export default GuessingSquareArea;
