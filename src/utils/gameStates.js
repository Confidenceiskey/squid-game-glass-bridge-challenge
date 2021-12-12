export const initialGameState = [
  {
    level: 0,
    location: "platform",
    platform: {
      state: [
        [1, false],
        [2, false],
        [3, false],
        [4, false],
        [5, false],
        [6, false],
        [7, false],
        [8, false],
        [9, false],
      ],
    },
  },
  {
    level: 1,
    squares: [
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "leftTopSquares",
      },
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "bottomRightSquares",
      },
    ],
  },
  {
    level: 2,
    squares: [
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "leftTopSquares",
      },
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "bottomRightSquares",
      },
    ],
  },
  {
    level: 3,
    squares: [
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "leftTopSquares",
      },
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "bottomRightSquares",
      },
    ],
  },
  {
    level: 4,
    squares: [
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "leftTopSquares",
      },
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "bottomRightSquares",
      },
    ],
  },
  {
    level: 5,
    squares: [
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "leftTopSquares",
      },
      {
        state: Array(9).fill([null, false]),
        status: "unknown",
        location: "bottomRightSquares",
      },
    ],
  },
  {
    level: 6,
    location: "platform",
    platform: {
      state: Array(9).fill([null, false]),
    },
  },
];

export const initialStatusOfPlayers = [
  [1, "alive"],
  [2, "alive"],
  [3, "alive"],
  [4, "alive"],
  [5, "alive"],
  [6, "alive"],
  [7, "alive"],
  [8, "alive"],
  [9, "alive"],
];
