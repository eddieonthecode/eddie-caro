import { useEffect, useRef, useState } from "react";
import "./board.css";

type Props = {
  xIcon: string;
  oIcon: string;
  size: number;
  streak: number;
  gameStart: boolean;
  onRestart: (winner?: string) => void;
};

type GameTurn = {
  player: string;
  row: number;
  col: number;
  isWinSquare?: boolean;
};

type Square = {
  player: string;
  isWinSquare?: boolean;
};

const initialPlayer = "X";

export default function Board({
  xIcon,
  oIcon,
  size,
  streak,
  gameStart,
  onRestart,
}: Props) {
  let board: Square[][] = Array.from({ length: size }, () =>
    Array(size).fill({
      player: null,
      isWinSquare: false,
    })
  );
  const [gameTurns, setGameTurns] = useState<GameTurn[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [winDirection, setWinDirection] = useState<number>(-1);

  const currPosition = useRef({
    row: -1,
    col: -1,
  });

  gameTurns.forEach((turn) => {
    board[turn.row][turn.col] = {
      player: turn.player,
      isWinSquare: turn.isWinSquare,
    };
  });

  const currPlayer = gameTurns[0]?.player;

  const squareSize =
    (Math.min(window.innerHeight - 250, window.innerWidth) - 24) / size;

  const fontSize = Math.floor((squareSize * 3) / 5);

  useEffect(() => {
    if (gameStart) {
      setGameTurns([]);
      setIsPlaying(true);
    }
  }, [gameStart]);

  useEffect(() => {
    if (isPlaying) {
      // When board changes check the winner
      checkWinner(currPosition.current.row, currPosition.current.col);

      // Check if the game is draw
      if (gameTurns.length >= size * size) {
        setIsPlaying(false);
        onRestart();
      }
    }
  }, [gameTurns]);

  /**
   * Handle select square
   */
  function handleSelectSquare(row: number, col: number) {
    // Set current position
    currPosition.current = {
      row,
      col,
    };

    // Append a new turn
    setGameTurns((prevTurns) => [
      {
        row,
        col,
        player: currPlayer ? (currPlayer === "X" ? "0" : "X") : initialPlayer,
      },
      ...prevTurns,
    ]);
  }

  /**
   * Check winner
   */
  function checkWinner(row: number, col: number) {
    if (row < 0 || col < 0) return;

    let listDirections: GameTurn[][] = [];

    // Horizontal
    let horizontalSquares: GameTurn[] = [];
    for (let i = 0; i < size; i++) {
      horizontalSquares.push({
        row,
        col: i,
        player: board[row][i].player,
      });
    }

    // Vertical
    let verticalSquares: GameTurn[] = [];
    for (let i = 0; i < size; i++) {
      verticalSquares.push({
        row: i,
        col,
        player: board[i][col].player,
      });
    }

    // Cross left - Sub of coordinate is const
    let sub = row - col;
    let crossLeftSquares: GameTurn[] = [];

    for (let i = 0; i < size; i++) {
      let currRow = i;
      let currCol = currRow - sub;

      crossLeftSquares.push({
        row: currRow,
        col: currCol,
        player: board[currRow][currCol]?.player || "",
      });
    }

    // Cross right - Sum of coordinate is const
    let sum = row + col;
    let crossRightSquares: GameTurn[] = [];

    for (let i = size - 1; i >= 0; i--) {
      let currRow = i;
      let currCol = sum - currRow;

      crossRightSquares.push({
        row: currRow,
        col: currCol,
        player: board[currRow][currCol]?.player || "",
      });
    }

    listDirections = [
      horizontalSquares,
      verticalSquares,
      crossLeftSquares,
      crossRightSquares,
    ];

    // Have winner
    listDirections.some((direction, index) => {
      let winSquares = directionHaveWinner(direction);
      if (winSquares) {
        setIsPlaying(false);
        setWinDirection(index);
        setGameTurns((prevTurns) => {
          let newTurns = [...prevTurns].map((turn) => {
            if (
              winSquares?.some((s) => s.row === turn.row && s.col === turn.col)
            ) {
              turn.isWinSquare = true;
            }

            return turn;
          });

          return newTurns;
        });
        onRestart(currPlayer);
        return true;
      }

      return false;
    });
  }

  function directionHaveWinner(squares: GameTurn[]): GameTurn[] | null {
    let winSquares: GameTurn[] = [];

    for (let i = 0; i < squares.length; i++) {
      if (squares[i - 1]?.player !== squares[i].player) {
        winSquares = [squares[i]];
        continue;
      }

      if (squares[i].player) winSquares.push(squares[i]);

      if (winSquares.length >= streak) return winSquares;
    }

    return null;
  }

  return (
    <div className="board-container">
      <div
        className="board"
        style={{ fontSize: `${fontSize}px`, rowGap: `${fontSize / 3}px` }}
      >
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="row"
            style={{
              flexBasis: `${100 / size}%`,
              columnGap: `${fontSize / 3}px`,
            }}
          >
            {row.map((col, colIndex) => (
              <div
                key={`${rowIndex} - ${colIndex}`}
                className={
                  `col win-direction-${winDirection} ` +
                  (col.player || !isPlaying ? "disable" : "") +
                  (col.isWinSquare && " win-square")
                }
                style={{
                  flexBasis: `${100 / size}%`,
                  borderRadius: fontSize / 6,
                }}
                onClick={() => {
                  !col.player &&
                    isPlaying &&
                    handleSelectSquare(rowIndex, colIndex);
                }}
              >
                {col.player && <p> {col.player === "X" ? xIcon : oIcon}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
