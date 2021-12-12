/**
 * A function that starts the countdown timer.
 * @param {Function} setIsTimerRunning 
 * @returns {Function}
 */
export const startTimer = (setIsTimerRunning) => setIsTimerRunning(true);

/**
 * This is a function that randomly generates a winning path for the game. It returns an array of string values.
 * LT = left or top guessing square
 * BR = bottom or right guessing square
 * @returns Array (Ex: ['1BR', '2LT', '3LT', '4LT', '5BR'])
 */
export const generateCorrectPath = () => {
  let winningPath = [];

  for (let i = 1; i < 6; i++) {
    const randomNumber = Math.round(Math.random());

    winningPath.push(`${i}${randomNumber === 1 ? "LT" : "BR"}`);
  }
  return winningPath;
};

export const scrollToStart = () => {
  const isPortraitMode = document.body.scrollHeight > document.body.scrollWidth;
  
  if (isPortraitMode) {
    const scrollAmount = document.querySelector(".game-board-wrapper").scrollHeight;
    window.scrollTo({ top: scrollAmount, behavior: 'smooth'});
  } else {
    document.querySelector('.squid-game').scrollTo({ left: 0, behavior: 'smooth' });
  }
};

/**
 *
 * @param {number} unlockedLevel The highest unlocked level overall in the game (0 - 6)
 * @param {number} currentLevel The current level that the user is interacting with (0 - 6)
 * @returns string ("locked" || "")
 */
export const getSectionAccessState = (unlockedLevel, currentLevel) => (currentLevel <= unlockedLevel ? "" : "locked");

/**
 *
 * @param {function} setUnlockedLevel This is a state setter that increases the unlocked level by 1
 * @returns number (Ex: current unlocked level + 1)
 */
export const unlockNextLevel = (setUnlockedLevel) =>
  setUnlockedLevel((previousUnlockedLevel) => previousUnlockedLevel + 1);

/**
 *
 * @param {"squares" | "platform"} clickLevel The section (or level) of the game that the user clicked on.
 * @returns string ("platform" || "squares")
 */
export const findGameSection = (level) => {
  if (level > 0 && level < 6) {
    return "squares";
  }
  return "platform";
};

/**
 * This function calculates what is happening in the present game and returns 4 variables
 * @param {Object} playableLevels 
 * @param {Number} tileValue 
 * @returns 
 */
export const findSelectedGameStates = (gameState, tileValue, unlockedLevel) => {
  const playableLevels = gameState.slice(0, unlockedLevel + 1);
  const selected = playableLevels
  .map((playableLevel) => {
    const level = playableLevel.level;
    const gameSection = findGameSection(level);
  
    if (gameSection === "platform") {
      return { level, tile: playableLevel[gameSection].state.filter((tile) => tile[1] === true) };
    }
  
    // gameSection is "squares"
    const selectedTileSquare = playableLevel[gameSection]
      .map((square) => square.state.filter((tile) => tile[1] === true))
      .filter((result) => result.length > 0);
  
    return { level, tile: selectedTileSquare.map((firstResult) => firstResult[0]) };
  })
  .filter((result) => result.tile.length > 0);
  
  const isAnyTileSelected = selected.length === 1;
  const isSameTileClicked = isAnyTileSelected ? selected[0].tile[0][0] === tileValue : false;
  const selectedTileLevel = isAnyTileSelected ? selected[0].level : null;

  return ({
    isAnyTileSelected,
    isSameTileClicked,
    selected,
    selectedTileLevel,
  })
}

/**
 * This function splits the entire bridge state into respective halfs
 * @param {[{level: number, squares: [{state: [[number, boolean]], status: "unknown" | "occupied" | "incorrect", location: "bottomRightSquares" | "leftTopSquares"}]}]} bridgeState
 * @param {String} section
 * @returns {[{level: number, square: {state: [[number, boolean]], status: "unknown" | "occupied" | "incorrect", location: "bottomRightSquares" | "leftTopSquares"}}]} Upper/left or lower/bottom half of the bridge state object
 */
export const splitBridgeInHalf = (bridgeState, section) =>
  bridgeState.map((levelState) => ({
    level: levelState.level,
    square: levelState.squares.filter((square) => square.location === section)[0],
  }));

/**
 * This function simply reverses the selection state of a tile that is clicked on.
 *
 * @param {function} setGameState This is a state setter that modifies the game state
 * @param {object} gameState The current game's state in the game.
 * @param {number} clickLevel The level that the user clicked on (0 - 6)
 * @param {number} tileIndexNumber The index number of the tile that was clicked on (0 - 9)
 */
export const reverseTileSelection = (clickLevel, gameState, setGameState, tileIndexNumber) => {
  const gameSection = findGameSection(clickLevel);

  if (gameSection === "platform") {
    setGameState([
      ...gameState.map((section) => {
        if (section.level === clickLevel) {
          return {
            ...section,
            [gameSection]: {
              ...section[gameSection],
              state: [
                ...section[gameSection].state.slice(0, tileIndexNumber),
                [section[gameSection].state[tileIndexNumber][0], !section[gameSection].state[tileIndexNumber][1]],
                ...section[gameSection].state.slice(tileIndexNumber + 1),
              ],
            },
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  if (gameSection === "squares") {
    setGameState([
      ...gameState.map((section) => {
        if (section.level === clickLevel) {
          return {
            ...section,
            [gameSection]: [
              ...section[gameSection].map((square) => {
                if (square.status === "occupied") {
                  return {
                    ...square,
                    state: [
                      ...square.state.map((tile, index) => {
                        if (tileIndexNumber === index) {
                          return [tile[0], !tile[1]];
                        } else {
                          return [...tile];
                        }
                      }),
                    ],
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }
};

/**
 *
 * @param {Object} gameState The current game's state in the game.
 * @param {Number} level The level that the user clicked on (Ex: 0 - 6)
 * @param {String} position Indicates if the square's position is in the bottom right or left top (Ex: 'BR' | 'LT')
 * @param {Function} setGameState This is a state setter that modifies the game state
 * @param {String} squareStatus The status of the square that was clicked on (Ex: 'unknown' | 'occupied' | 'incorrect')
 */
export const changeSquareStatusTo = (gameState, level, position, setGameState, squareStatus) => {
  const clickLevel = level;
  const gameSection = findGameSection(clickLevel);
  const squareLocation = position === "BR" ? "bottomRightSquares" : "leftTopSquares";

  setGameState([
    ...gameState.map((section) => {
      if (section.level === clickLevel) {
        return {
          ...section,
          [gameSection]: [
            ...section[gameSection].map((square) => {
              if (square.location === squareLocation) {
                return {
                  ...square,
                  status: squareStatus,
                };
              } else {
                return { ...square };
              }
            }),
          ],
        };
      } else {
        return { ...section };
      }
    }),
  ]);
};

/**
 * This function determines which player is selected on the previous level and returns an object with the player number
 * and the tile index number.
 * @param {Object} gameState
 * @param {Number} level (Ex: 0 - 5)
 * @returns {{ selectedPlayerNumber: Number, selectedTileIndex: Number}} A player number between 1-9 and the corresponding tile index number
 */
export const findSelectedPlayer = (gameState, level) => {
  const gameSection = findGameSection(level - 1);
  if (gameSection === "platform") {
    const selectedTile = gameState[level - 1][gameSection].state.filter((tileState) => tileState[1] === true)[0];
    const indexOfTile = gameState[level - 1][gameSection].state.indexOf(selectedTile);
    return { selectedPlayerNumber: selectedTile[0], selectedTileIndex: indexOfTile };
  }

  if (gameSection === "squares") {
    const selectedTile = gameState[level - 1][gameSection]
      .map((square) => square.state.filter((tile) => tile[1] === true))
      .filter((result) => result.length > 0)[0][0];
    const indexOfTile = gameState[level - 1][gameSection]
      .filter((square) => square.status === "occupied")
      .map((square) => square.state.indexOf(selectedTile))[0];
    return { selectedPlayerNumber: selectedTile[0], selectedTileIndex: indexOfTile };
  }
};

/**
 * This function updates the status of players state by removing the player that was "killed"
 * @param {Number} selectedPlayerNumber
 * @param {Function} setStatusOfPlayers
 * @param {[[Number, "alive" | "dead"]]} statusOfPlayers
 */
export const kill = (selectedPlayerNumber, setStatusOfPlayers, statusOfPlayers) => {
  setStatusOfPlayers([
    ...statusOfPlayers.map((playerStatus) => {
      if (playerStatus[0] === selectedPlayerNumber) {
        return [playerStatus[0], "dead"];
      } else {
        return [...playerStatus];
      }
    }),
  ]);
};

/**
 * This function removes a player from the game board when the user guesses incorrectly.
 * @param {Number} level The level that the user clicked on (Ex: 0 - 6)
 * @param {Number} selectedTileIndex
 * @param {Function} setGameState
 * @param {Function} setPlayersAliveCount
 */
export const removePlayerFromGameBoard = (level, selectedTileIndex, setGameState, setPlayersAliveCount) => {
  const previousClickLevel = level - 1;
  const gameSection = findGameSection(previousClickLevel);

  if (gameSection === "platform") {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === previousClickLevel) {
          return {
            ...section,
            [gameSection]: {
              ...section[gameSection],
              state: [
                ...section[gameSection].state.map((tile, index) => {
                  if (index === selectedTileIndex) {
                    return [-1, false];
                  } else {
                    return [...tile];
                  }
                }),
              ],
            },
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  if (gameSection === "squares") {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === previousClickLevel) {
          return {
            ...section,
            [gameSection]: [
              ...section[gameSection].map((square) => {
                if (square.status === "occupied") {
                  const newSquareStatus =
                    square.state.filter(([tileValue]) => tileValue !== null).length > 1 ? "occupied" : "unknown";
                  return {
                    ...square,
                    state: [
                      ...square.state.map((tile, index) => {
                        if (index === selectedTileIndex) {
                          return [null, false];
                        } else {
                          return [...tile];
                        }
                      }),
                    ],
                    status: newSquareStatus,
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  setPlayersAliveCount((previousPlayerCount) => previousPlayerCount - 1);
};

/**
 * This function moves a selected player on the game board to the next level
 * @param {Number} level The level that the user clicked on (Ex: 0 - 6)
 * @param {'BR' | 'LT'} position ('BR' | 'LT')
 * @param {{ selectedPlayerNumber: Number, selectedTileIndex: Number}} selectedPlayer A player number between 1-9 and the corresponding tile index number
 * @param {Function} setGameState
 */
export const advancePlayerToNextLevel = (level, position, selectedPlayer, setGameState) => {
  const { selectedPlayerNumber, selectedTileIndex } = selectedPlayer;
  const squareLocation = position === "BR" ? "bottomRightSquares" : "leftTopSquares";
  const previousClickLevel = level - 1;
  const previousGameSection = findGameSection(previousClickLevel);
  const currentClickLevel = level;
  const currentGameSection = findGameSection(level);

  if (previousGameSection === "platform") {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === previousClickLevel) {
          return {
            ...section,
            [previousGameSection]: {
              ...section[previousGameSection],
              state: [
                ...section[previousGameSection].state.slice(0, selectedTileIndex),
                [-1, false],
                ...section[previousGameSection].state.slice(selectedTileIndex + 1),
              ],
            },
          };
        } else if (section.level === currentClickLevel) {
          return {
            ...section,
            [currentGameSection]: [
              ...section[currentGameSection].map((square) => {
                const emptySquare = square.state.filter((squareTile) => squareTile[0] !== null).length === 0;
                if (square.location === squareLocation && emptySquare) {
                  return {
                    ...square,
                    state: [...square.state.slice(0, 4), [selectedPlayerNumber, false], ...square.state.slice(5)],
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  if (previousGameSection === "squares" && currentClickLevel < 6) {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === previousClickLevel) {
          return {
            ...section,
            [previousGameSection]: [
              ...section[previousGameSection].map((square) => {
                if (square.status === "occupied") {
                  const newSquareStatus =
                    square.state.filter(([tileValue]) => tileValue !== null).length > 1 ? "occupied" : "unknown";
                  return {
                    ...square,
                    state: [
                      ...square.state.slice(0, selectedTileIndex),
                      [null, false],
                      ...square.state.slice(selectedTileIndex + 1),
                    ],
                    status: newSquareStatus,
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else if (section.level === currentClickLevel) {
          return {
            ...section,
            [previousGameSection]: [
              ...section[previousGameSection].map((square) => {
                if (square.location === squareLocation) {
                  return {
                    ...square,
                    state: [...square.state.slice(0, 4), [selectedPlayerNumber, false], ...square.state.slice(5)],
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }
};

export const movePlayerToSelectedTile = (
  clickLevel,
  selectedPlayerInfo,
  selectedLevel,
  setGameState,
  clickedTileIndexNumber
) => {
  const { selectedPlayerNumber, selectedTileIndex } = selectedPlayerInfo;
  const previousGameSection = findGameSection(selectedLevel);
  const currentGameSection = findGameSection(clickLevel);

  if (previousGameSection === "platform") {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === selectedLevel) {
          return {
            ...section,
            [previousGameSection]: {
              ...section[previousGameSection],
              state: [
                ...section[previousGameSection].state.slice(0, selectedTileIndex),
                [-1, false],
                ...section[previousGameSection].state.slice(selectedTileIndex + 1),
              ],
            },
          };
        } else if (section.level === clickLevel) {
          return {
            ...section,
            [currentGameSection]: [
              ...section[currentGameSection].map((square) => {
                if (square.status === "occupied") {
                  return {
                    ...square,
                    state: [
                      ...square.state.slice(0, clickedTileIndexNumber),
                      [selectedPlayerNumber, false],
                      ...square.state.slice(clickedTileIndexNumber + 1),
                    ],
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  if (previousGameSection === "squares" && clickLevel < 6) {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === selectedLevel) {
          return {
            ...section,
            [previousGameSection]: [
              ...section[previousGameSection].map((square) => {
                if (square.status === "occupied") {
                  const newSquareStatus =
                    square.state.filter(([tileValue]) => tileValue !== null).length > 1 ? "occupied" : "unknown";
                  return {
                    ...square,
                    state: [
                      ...square.state.slice(0, selectedTileIndex),
                      [null, false],
                      ...square.state.slice(selectedTileIndex + 1),
                    ],
                    status: newSquareStatus,
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else if (section.level === clickLevel) {
          return {
            ...section,
            [currentGameSection]: [
              ...section[currentGameSection].map((square) => {
                if (square.status === "occupied") {
                  return {
                    ...square,
                    state: [
                      ...square.state.slice(0, clickedTileIndexNumber),
                      [selectedPlayerNumber, false],
                      ...square.state.slice(clickedTileIndexNumber + 1),
                    ],
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }

  if (clickLevel === 6) {
    setGameState((previousGameState) => [
      ...previousGameState.map((section) => {
        if (section.level === selectedLevel) {
          return {
            ...section,
            [previousGameSection]: [
              ...section[previousGameSection].map((square) => {
                if (square.status === "occupied") {
                  const newSquareStatus =
                    square.state.filter(([tileValue]) => tileValue !== null).length > 1 ? "occupied" : "unknown";
                  return {
                    ...square,
                    state: [
                      ...square.state.slice(0, selectedTileIndex),
                      [null, false],
                      ...square.state.slice(selectedTileIndex + 1),
                    ],
                    status: newSquareStatus,
                  };
                } else {
                  return { ...square };
                }
              }),
            ],
          };
        } else if (section.level === clickLevel) {
          return {
            ...section,
            [currentGameSection]: {
              ...section[currentGameSection],
              state: [
                ...section[currentGameSection].state.slice(0, clickedTileIndexNumber),
                [selectedPlayerNumber, false],
                ...section[currentGameSection].state.slice(clickedTileIndexNumber + 1),
              ],
            },
          };
        } else {
          return { ...section };
        }
      }),
    ]);
  }
};
