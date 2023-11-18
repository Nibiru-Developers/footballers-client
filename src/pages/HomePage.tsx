import { Fragment, useEffect } from "react";
import io from "socket.io-client";
import { useAtom } from "jotai";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import _ from "lodash";
import {
  onlineStatusLoadingAtom,
  onlineStatusAtom,
  socketConnectionAtom,
  userIdAtom,
  userNameAtom,
  usersOnlineAtom,
  waitingStatusLoadingAtom,
  playingAtom,
  roomIdAtom,
  questionsAtom,
  timeRemainingAtom,
  scoresAtom,
} from "../global/GlobalData";
import Navbar from "../components/Navbar";
import Env from "../utils/Env";
import { popToast } from "../utils/Toast";
import { Slide } from "react-slideshow-image";
import { QuestionType } from "../types/Question";

const badgeColor = [
  "#F05941",
  "#FF6969",
  "#EE9322",
  "#C70039",
  "#FFBB5C",
  "#0766AD",
  "#83A2FF",
  "#29ADB2",
  "#39A7FF",
  "#072541",
  "#186F65",
  "#016A70",
  "#A6FF96",
  "#7A9D54",
  "#4C4B16",
  "#F3B664",
  "#FFCD4B",
  "#EFD595",
  "#D2DE32",
  "#E7B10A",
];

export default function HomePage() {
  const [onlineStatus, setOnlineStatus] = useAtom(onlineStatusAtom);
  const [onlineStatusLoading, setOnlineStatusLoading] = useAtom(
    onlineStatusLoadingAtom
  );

  const [waitingStatusLoading, setWaitingStatusLoading] = useAtom(
    waitingStatusLoadingAtom
  );
  const [playing, setPlaying] = useAtom(playingAtom);
  const [timeRemaining, setTimeRemaining] = useAtom(timeRemainingAtom);
  const [questions, setQuestions] = useAtom(questionsAtom);
  const [scores, setScores] = useAtom(scoresAtom);

  const [userId] = useAtom(userIdAtom);
  const [userName, setUserName] = useAtom(userNameAtom);
  const [roomId, setRoomId] = useAtom(roomIdAtom);

  const [socketConnection, setSocketConnection] = useAtom(socketConnectionAtom);
  const [usersOnline, setUsersOnline] = useAtom(usersOnlineAtom);

  useEffect(() => {
    socketConnection?.on("matchFinished", () => {
      setPlaying(false);

      let score = 0;
      questions.forEach((question) => {
        if (question.choice === question.answer) {
          score += 20;
        }
      });

      socketConnection.emit("storeScore", {
        userId: userId,
        roomId: roomId,
        score: score,
      });
    });
  }, [playing]);

  const goOnline = () => {
    if (!userName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Input Your User Name!",
      });
    } else {
      setOnlineStatusLoading(true);
      const socketIO = io(Env.SOCKET_URL, {
        query: {
          userId,
          userName,
        },
      });

      socketIO.on("connect", () => {
        setOnlineStatusLoading(false);
        setSocketConnection(socketIO);
        setOnlineStatus(true);
        toast.success("You're Connected!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });

      socketIO.on("userOnlineUpdate", (response) => {
        setUsersOnline(response.users);
      });

      socketIO.on("findingMatch", (response) => {
        setWaitingStatusLoading(true);
        popToast(response.message);
      });

      socketIO.on("matchFound", (response) => {
        setWaitingStatusLoading(false);
        setRoomId(response.roomId);
        setPlaying(true);
        setQuestions(
          response.questions.map((question: QuestionType) => ({
            ...question,
            choice: "",
          }))
        );
        popToast(response.message);
      });

      socketIO.on("matchStarted", (response) => {
        setTimeRemaining(response.timeRemaining);
      });

      socketIO.on("matchFinished", (response) => {
        popToast(response.message);
      });

      socketIO.on("giveResultScore", (response) => {
        setScores(response.scores);
      });
    }
  };
  

  const goOffline = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be disconnected from server!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Disconnect!",
    }).then((result) => {
      if (result.isConfirmed) {
        socketConnection?.disconnect();
        setSocketConnection(null);
        setOnlineStatusLoading(false);
        setOnlineStatus(false);
        setUsersOnline([]);

        resetGame();
      }
    });
  };

  const matchmaking = () => {
    resetGame();
    socketConnection?.emit("matchmaking", {
      userId,
      userName,
    });
  };

  const resetGame = () => {
    setRoomId("");
    setWaitingStatusLoading(false);
    setPlaying(false);
    setTimeRemaining(0);
    setQuestions([]);
    setScores([]);
  };

  const answerQuestion = (answer: string, index: number) => {
    const newAnsweredQuestions = [...questions];
    newAnsweredQuestions[index] = {
      ...newAnsweredQuestions[index],
      choice: answer,
    };
    setQuestions(newAnsweredQuestions);
  };

  return (
    <Fragment>
      <Navbar />

      <div className="container my-3">
        <p className="mb-2">User ID: {userId}</p>
        {userName && <p className="mb-2">User Name: {userName}</p>}
        {socketConnection?.id && (
          <p className="mb-2">Socket ID: {socketConnection.id}</p>
        )}
        {roomId && <p className="mb-2">Room ID: {roomId}</p>}

        {!onlineStatus && (
          <input
            type="text"
            style={{ maxWidth: "450px" }}
            className="form-control mb-2"
            placeholder="Input User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        )}

        {onlineStatusLoading ? (
          <div className="mb-3">
            <button className="btn btn-primary btn-sm" type="button" disabled>
              <span
                className="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>{" "}
              Connecting...
            </button>
          </div>
        ) : (
          <>
            {onlineStatus ? (
              <div className="mb-3">
                <button className="btn btn-danger btn-sm" onClick={goOffline}>
                  Go Offline
                </button>
              </div>
            ) : (
              <div className="mb-3">
                <button className="btn btn-primary btn-sm" onClick={goOnline}>
                  Go Online
                </button>
              </div>
            )}
          </>
        )}

        {onlineStatus && (
          <>
            {waitingStatusLoading ? (
              <div className="mb-3 d-flex justify-content-center">
                <button className="btn btn-primary" type="button" disabled>
                  <span
                    className="spinner-grow spinner-grow-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>{" "}
                  Finding Match, Please Wait...
                </button>
              </div>
            ) : (
              <>
                {!playing ? (
                  <>
                    <div className="mb-3 d-flex justify-content-center">
                      <button className="btn btn-primary" onClick={matchmaking}>
                        Play Now!
                      </button>
                    </div>
                    {Boolean(scores.length) && (
                      <div
                        className="bg-light px-3 py-4 rounded mx-auto mt-4"
                        style={{ maxWidth: "350px" }}
                      >
                        <h1 className="text-center fs-2 mb-3">SCORE</h1>
                        {_.sortBy(scores, "score")
                          .reverse()
                          .map((score, index) => (
                            <div key={index}>
                              <p className="my-2">
                                {index + 1}. {score.userName} ({score.userId}) -{" "}
                                {score.score} Poin
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h1 className="text-center">
                      {timeRemaining ? timeRemaining : "..."}
                    </h1>
                    <Slide
                      autoplay={false}
                      onChange={function noRefCheck() {}}
                      onStartChange={function noRefCheck() {}}
                      transitionDuration={500}
                    >
                      {questions.map((question, index) => (
                        <div
                          key={index}
                          className="each-slide-effect px-5 py-4 bg-light rounded"
                        >
                          <h5>Footballers Quiz</h5>
                          <div>
                            <div className="fw-bold mb-3">
                              <span>
                                {index + 1}. {question.question}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span
                                onClick={() => answerQuestion("a", index)}
                                className={`${
                                  question.choice === "a" && "fw-bold"
                                } pointer`}
                              >
                                A. {question.options.a}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span
                                onClick={() => answerQuestion("b", index)}
                                className={`${
                                  question.choice === "b" && "fw-bold"
                                } pointer`}
                              >
                                B. {question.options.b}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span
                                onClick={() => answerQuestion("c", index)}
                                className={`${
                                  question.choice === "c" && "fw-bold"
                                } pointer`}
                              >
                                C. {question.options.c}
                              </span>
                            </div>
                            <div className="mb-1">
                              <span
                                onClick={() => answerQuestion("d", index)}
                                className={`${
                                  question.choice === "d" && "fw-bold"
                                } pointer`}
                              >
                                D. {question.options.d}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slide>
                  </>
                )}
              </>
            )}
          </>
        )}

        {onlineStatus && (
          <>
            <h5 className="mt-4">User Online:</h5>
            <div className="d-flex" style={{ flexWrap: "wrap" }}>
              {usersOnline.map((user) => (
                <span
                  key={user.userId}
                  style={{ backgroundColor: badgeColor[_.random(1, 20) - 1] }}
                  className="badge text-white me-1 mb-2"
                >
                  {user.userName}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </Fragment>
  );
}
