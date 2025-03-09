import { useEffect, useRef, useState } from "react";
import "./board.css";

type Props = {
  xIcon: string;
  oIcon: string;
  size: number;
  streak: number;
  isPlaying: boolean;
  onFinish: (winner?: string) => void;
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
  isPlaying,
  onFinish,
}: Props) {
  let board: Square[][] = Array.from({ length: size }, () =>
    Array(size).fill({
      player: null,
      isWinSquare: false,
    })
  );
  const [gameTurns, setGameTurns] = useState<GameTurn[]>([]);
  const [winDirection, setWinDirection] = useState<number>(-1);

  const currPosition = useRef({
    row: -1,
    col: -1,
  });

  const currPlayer = gameTurns[0]?.player;

  const squareSize =
    (Math.min(window.innerHeight - 280, window.innerWidth) - 24) / size;

  const fontSize = Math.floor((squareSize * 3) / 5);

  // Build board base on GameTurns
  buildBoard();

  useEffect(() => {
    // Remove all turns when start a game
    if (isPlaying) {
      setGameTurns([]);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      // When board changes check the winner
      if (checkWinner(currPosition.current.row, currPosition.current.col))
        return;

      // Check if the game is draw
      if (gameTurns.length >= size * size) {
        onFinish();
      }
    }
  }, [gameTurns]);

  /**
   * Build board
   */
  function buildBoard() {
    gameTurns.forEach((turn) => {
      if (board[turn.row] && board[turn.row][turn.col]) {
        board[turn.row][turn.col] = {
          player: turn.player,
          isWinSquare: turn.isWinSquare,
        };
      }
    });
  }

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
  function checkWinner(row: number, col: number): boolean {
    if (row < 0 || col < 0) return false;

    // Build directions which contain the current square
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

    // Check winner
    return listDirections.some((direction, index) => {
      let winSquares = directionHaveWinner(direction);

      // Have winner
      if (winSquares) {
        handleWinner(winSquares, index);
        return true;
      }

      return false;
    });
  }

  /**
   * Check direction have winner
   */
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

  /**
   * Handle when the game has the winner
   */
  function handleWinner(winSquares: GameTurn[], index: number) {
    setWinDirection(index);
    setGameTurns((prevTurns) => {
      let newTurns = [...prevTurns].map((turn) => {
        if (winSquares?.some((s) => s.row === turn.row && s.col === turn.col)) {
          turn.isWinSquare = true;
        }

        return turn;
      });

      return newTurns;
    });
    onFinish(currPlayer);
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
                className={`col ` + (col.player || !isPlaying ? "disable" : "")}
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
                {col.isWinSquare && (
                  <div
                    className={`win-line win-direction-${winDirection}`}
                    style={{
                      width:
                        ((winDirection >= 2 ? 1.42 : 1) * (squareSize * 7)) / 6,
                      height: squareSize / 20,
                      boxShadow: `0 0 ${fontSize / 6}px ${
                        fontSize / 6
                      }px rgba(255, 0, 0, 0.5)`,
                    }}
                  ></div>
                )}
                {col.player && <p> {col.player === "X" ? xIcon : oIcon}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
