import "./styles.css";
import Board from "./Board";
import { useState } from "react";

const initialSize = 3;
const initialStreak = 3;
const initialXIcon = "✖️";
const initial0Icon = "⭕";
const congratsImages = [
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExa3lncjBzb3k3dWNqenUzeTY3dGk0cXh1dWwzMWh5MDBpc3J1N2hmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g9582DNuQppxC/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExampkYnB0cjk3b2d4bmhsY2pxcnRyZXJ1MTNhMG82N3p5cWV1MHdvdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L2o1fRY14ZgrzGWWQh/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXhiYnF3bWp2MGxyZW9qY3RkZ3VjZ3c1MHN5Mjk4YXo1dmI0dXlnMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bw9sc2HXiK5ES9mJU4/giphy.gif",
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3gzdm5hdG5mZmFsNHUxZGVpeTJ3azMydjk5dG9iMGFrcXRka2dvbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UsTNoiGR7OBsDcUvuG/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXZjZTJvazBzaHhkMWY3bDRqZnVjeTU1ZXE5aWIyZzFuNWF3YmxpNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xGoEtS4H6uUT8k/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGZxbXczdWx6b2g3ZDd1eXlyeDF3N3U4d3hvcGtpaG5qYnNncnllZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26DOoDwdNGKAg6UKI/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN20zMTN4dmFiZjJtcjh2ZXl5M3Rma2FtMmZub2c1ejl4N3J6Ynl4cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPGGzU2dc1AjtFN2o/giphy.gif",
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2syejUzYzc2NnpxbDRhYTZ4azV1cGUwZDBoN242N2dqaXJ2Zml1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0ksns8g525Jg5t7aTM/giphy.gif",
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTI2ZXprY2w2czJub3NsejhldWRuNXdtazdvcmI5NjNhdDhxM2t4aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rqecUwSATGGMfuUi13/giphy.gif",
  "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHdlZHY3dDkzcDR2aW94Y2NlaW41MDAzczFicmkydXFrNnZ0dWplYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GYWZd329enuFxLtLNF/giphy.gif",
];

export default function App() {
  const [xIcon, setXIcon] = useState<string>();
  const [oIcon, set0Icon] = useState<string>();
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
                Congratulations.
                {winner === "X" ? xIcon || initialXIcon : oIcon || initial0Icon}
                wins 🎇🎇🎇!
              </h1>
              <img
                src={
                  congratsImages[
                    Math.floor(Math.random() * congratsImages.length)
                  ]
                }
                alt=""
                width={300}
                height={300}
                style={{
                  marginBottom: "20px",
                  display: "block",
                  objectFit: "contain",
                }}
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
                  placeholder="Size - 10"
                  value={size}
                  onChange={(e) => setSize(+(e.target.value ?? initialSize))}
                />
                <input
                  className="info__input"
                  type={"number"}
                  value={streak}
                  placeholder="Streak - 5"
                  onChange={(e) =>
                    setStreak(+(e.target.value ?? initialStreak))
                  }
                />
              </div>
              <div className="info">
                <input
                  className="info__input"
                  maxLength={10}
                  value={xIcon}
                  placeholder={`Default ${initialXIcon}`}
                  onChange={(e) => setXIcon(e.target.value)}
                />
                <input
                  className="info__input"
                  maxLength={10}
                  value={oIcon}
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
        xIcon={xIcon || initialXIcon}
        oIcon={oIcon || initial0Icon}
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
