import "./styles.css";
import Board from "./Board";
import { useState, useEffect } from "react";

const initialSize = 10;
const initialStreak = 5;
const initialXIcon = "✖️";
const initial0Icon = "⭕";

export default function App() {
  const [xIcon, setXIcon] = useState<string>(initialXIcon);
  const [oIcon, set0Icon] = useState<string>(initial0Icon);
  const [size, setSize] = useState<number>(initialSize);
  const [streak, setStreak] = useState<number>(initialStreak);
  const [gameStart, setGameStart] = useState<boolean>(false);
  const [gameCongrats, setGameCongrats] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>();
  const isValid = streak >= 3 && size >= streak;

  return (
    <div className="App">
      {gameCongrats && (
        <div className="modal">
          <div className="modal__container">
            <div
              className="modal__body"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1>
                Congratulations. {winner === "X" ? xIcon : oIcon} wins 🎇🎇🎇!
              </h1>
              <img
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExampkYnB0cjk3b2d4bmhsY2pxcnRyZXJ1MTNhMG82N3p5cWV1MHdvdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2o1fRY14ZgrzGWWQh/giphy.gif"
                alt=""
                width={300}
                height={300}
                style={{ marginBottom: "20px", display: "block" }}
              />
            </div>
            <div className="modal__footer">
              <button
                className="btn-start"
                onClick={() => setGameCongrats(false)}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
      {!gameCongrats && !gameStart && (
        <div className="modal">
          <div className="modal__container">
            <div className="modal__header">
              <h1>Welcome to Eddie Caro</h1>
            </div>
            <div className="modal__body">
              {!isValid && (
                <p className="notice">
                  Streak must be greater than 3 and Size must be greater than
                  Streak
                </p>
              )}
              <div className="info">
                <input
                  className="info__input"
                  type={"number"}
                  placeholder="Size"
                  value={size}
                  onChange={(e) => setSize(+(e.target.value ?? initialSize))}
                />
                <input
                  className="info__input"
                  type={"number"}
                  value={streak}
                  placeholder="Streak"
                  onChange={(e) =>
                    setStreak(+(e.target.value ?? initialStreak))
                  }
                />
              </div>
              <div className="info">
                <input
                  className="info__input"
                  maxLength={10}
                  placeholder={`Default ${initialXIcon}`}
                  onChange={(e) => setXIcon(e.target.value)}
                />
                <input
                  className="info__input"
                  maxLength={10}
                  placeholder={`Default ${initial0Icon}`}
                  onChange={(e) => set0Icon(e.target.value)}
                />
              </div>
            </div>
            <div className="modal__footer">
              <button
                disabled={!isValid}
                className={`btn-start ${!isValid && "disable"}`}
                onClick={() => {
                  setGameStart(true);
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}
      <Board
        xIcon={xIcon}
        oIcon={oIcon}
        size={size}
        streak={streak}
        onRestart={(w) => {
          setWinner(w);
          setGameCongrats(true);
          setGameStart(false);
        }}
      />
    </div>
  );
}
