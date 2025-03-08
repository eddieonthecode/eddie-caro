import { useEffect, useRef, useState } from "react";
import "./board.css";

type Props = {
  xIcon: string;
  oIcon: string;
  size: number;
  streak: number;
  onRestart: (winner: string) => void;
};

type GameTurn = {
  player: string;
  row: number;
  col: number;
};

const initialPlayer = "X";

export default function Board({
  xIcon,
  oIcon,
  size,
  streak,
  onRestart,
}: Props) {
  let board = Array.from({ length: size }, () => Array(size).fill(null));
  const [gameTurns, setGameTurns] = useState<GameTurn[]>([]);

  const currPosition = useRef({
    row: -1,
    col: -1,
  });

  gameTurns.forEach((turn) => {
    board[turn.row][turn.col] = turn.player;
  });

  const currPlayer = gameTurns[0]?.player;

  const squareSize =
    (Math.min(window.innerHeight - 50, window.innerWidth) - 24) / size;

  const fontSize = Math.floor((squareSize * 3) / 5);

  useEffect(() => {
    // When board changes check the winner
    checkWinner(currPosition.current.row, currPosition.current.col);
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

    let listDirections = [];
    // Horizontal
    let horizontalSquares = [];
    for (let i = 0; i < size; i++) {
      horizontalSquares.push(board[row][i]);
    }

    // Vertical
    let verticalSquares = [];
    for (let i = 0; i < size; i++) {
      verticalSquares.push(board[i][col]);
    }

    // Cross left - Sub of coordinate is const
    let sub = row - col;
    let crossLeftSquares = [];

    for (let i = 0; i < size; i++) {
      let currRow = i;
      let currCol = currRow - sub;

      crossLeftSquares.push(board[currRow] ? board[currRow][currCol] : null);
    }

    // Cross right - Sum of coordinate is const
    let sum = row + col;
    let crossRightSquares = [];

    for (let i = size - 1; i >= 0; i--) {
      let currRow = i;
      let currCol = sum - currRow;

      crossRightSquares.push(board[currRow] ? board[currRow][currCol] : null);
    }

    listDirections = [
      horizontalSquares,
      verticalSquares,
      crossLeftSquares,
      crossRightSquares,
    ];

    // Have winner
    if (listDirections.some((direction) => directionHaveWinner(direction))) {
      onRestart(currPlayer);
      setGameTurns([]);
    }
  }

  function directionHaveWinner(squares: (string | null)[]): boolean {
    let count = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i - 1] != squares[i]) {
        count = 1;
        continue;
      }

      if (squares[i]) count++;

      if (count >= streak) return true;
    }

    return false;
  }

  return (
    <div className="board-container">
      <div className="board" style={{ fontSize: `${fontSize}px` }}>
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="row"
            style={{ flexBasis: `${100 / size}%` }}
          >
            {row.map((col, colIndex) => (
              <div
                key={`${rowIndex} - ${colIndex}`}
                className={"col " + (col ? "disable" : "")}
                style={{ flexBasis: `${100 / size}%` }}
                onClick={() => {
                  !col && handleSelectSquare(rowIndex, colIndex);
                }}
              >
                {col && <p> {col === "X" ? xIcon : oIcon}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
