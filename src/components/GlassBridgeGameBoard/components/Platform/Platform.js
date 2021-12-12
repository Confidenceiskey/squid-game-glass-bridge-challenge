import React from "react";

import "./Platform.css";

const Platform = ({ gameStatus, handleTileClick, levelPlayerIsSelectedAt, platformAccess, platformState }) => {
  const { level, platform } = platformState;

  const gameSection = level === 0 ? "start" : "finish";
  const isPlatformUnlocked = platformAccess !== "locked";
  const noTileSelected = platform.state.filter((tileState) => tileState[1] === true).length === 0;

  const renderTile = (tileValue, selected, tileIndexNumber) => {
    const clickable = selected && isPlatformUnlocked && gameSection !== "finish" ? "selected" : "";
    const showTile = tileValue > 0 && gameStatus !== "not playing";
    const interactive =
      (isPlatformUnlocked && noTileSelected && tileValue !== -1 && gameSection === "start") ||
      (isPlatformUnlocked && selected && gameSection !== "finish") ||
      (levelPlayerIsSelectedAt === 5 && tileValue === null) //TO DO: add this kind of code to the guessing square area.
        ? "interactable"
        : "";

    return (
      <div
        className={`platform-tile ${interactive} ${clickable}`}
        key={`${gameSection}-${tileIndexNumber}`}
        onClick={() => handleTileClick(level, tileIndexNumber, tileValue)}
      >
        {showTile ? tileValue : ""}
      </div>
    );
  };

  return (
    <>
      {platform.state.map(([tileValue, selected], tileIndexNumber) => renderTile(tileValue, selected, tileIndexNumber))}
    </>
  );
};

export default Platform;
