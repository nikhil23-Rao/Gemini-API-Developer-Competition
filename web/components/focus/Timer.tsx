import { useState, useRef, useEffect } from "react";

export const Timer = () => {
  const [displayTime, setDisplayTime] = useState(1500);
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timerOn, setTimerOn] = useState(false);
  const [timerId, setTimerId] = useState("Session");
  let loop = undefined;

  const formatTime = (time) => {
    let minutes: any = Math.floor(time / 60);
    let seconds: any = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  const changeTime = (amount, type) => {
    let newCount;
    if (type === "Session") {
      newCount = sessionTime + amount;
    } else {
      newCount = breakTime + amount;
    }

    if (newCount > 0 && newCount <= 60 && !timerOn) {
      type === "Session" ? setSessionTime(newCount) : setBreakTime(newCount);
      if (type === "Session") {
        setDisplayTime(newCount * 60);
      }
    }
  };

  const setActive = () => {
    setTimerOn(!timerOn);
  };

  useEffect(() => {
    if (timerOn && displayTime > 0) {
      const interval = setInterval(() => {
        setDisplayTime(displayTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (displayTime === 0) {
      if (timerId === "Session") {
        setDisplayTime(breakTime * 60);
        setTimerId("Break");
      }
      if (timerId === "Break") {
        setDisplayTime(sessionTime * 60);
        setTimerId("Session");
      }
    }
  }, [breakTime, sessionTime, displayTime, timerId, timerOn]);

  const resetTime = () => {
    setBreakTime(5);
    setSessionTime(25);
    setDisplayTime(1500);
    setTimerId("Session");
    setTimerOn(false);
    clearInterval(loop);
  };

  return (
    <div className="app">
      <div
        id="clock"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: 50,
        }}
      >
        <div className="controls">
          <div className="break-container">
            <h5
              id="break-label"
              style={{
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
              className="text-gradient-timer"
            >
              Break Length
            </h5>
            <div className="btn-group">
              <button
                onClick={() => changeTime(1, "Break")}
                id="break-increment"
                className="timerbtn"
              >
                <i className="fa fa-arrow-up"></i>
              </button>
              <div
                className="glass"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  marginLeft: 10,
                }}
              >
                <p
                  id="break-length"
                  className="text-gradient-timer"
                  style={{ color: "#fff" }}
                >
                  {breakTime}
                </p>
              </div>
              <button
                onClick={() => changeTime(-1, "Break")}
                id="break-decrement"
                className="fa fa-arrow-down timerbtn"
              >
                <i className="fa-solid fa-circle-down"></i>
              </button>
            </div>
          </div>
          <div className="session-container">
            <h5
              id="session-label"
              style={{
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
              className="text-gradient-timer"
            >
              Session Length
            </h5>
            <div className="btn-group">
              <button
                onClick={() => changeTime(1, "Session")}
                id="session-increment"
                className="fa fa-arrow-up timerbtn"
              >
                <i className="fa-solid fa-circle-up"></i>
              </button>
              <div
                className="glass"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p
                  id="session-length"
                  className="text-gradient-timer"
                  style={{ color: "#fff" }}
                >
                  {sessionTime}
                </p>
              </div>
              <button
                onClick={() => changeTime(-1, "Session")}
                id="session-decrement"
                className="fa fa-arrow-down timerbtn"
              >
                <i className="fa-solid fa-circle-down"></i>
              </button>
            </div>
          </div>
        </div>
        <div
          className="timer glass"
          style={{
            marginTop: 40,
            textAlign: "center",
            border: "2px solid #fff",
          }}
        >
          <h4
            id="timer-label"
            className="text-gradient-timer"
            style={{
              marginBottom: 20,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            My {timerId}
          </h4>
          <h1
            id="time-left"
            className="text-gradient-timer"
            style={{
              color: "#fff",
              marginTop: 50,
              marginBottom: 50,
              fontSize: "7vw",
            }}
          >
            {formatTime(displayTime)}
          </h1>
          <div className="main-controls">
            <button onClick={setActive} id="start_stop" className="timerbtn">
              <i className={`fa fa-${timerOn ? "pause" : "play"}`}></i>
            </button>
            <button onClick={resetTime} id="reset" className="timerbtn">
              <i className="fa fa-rotate-left"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
