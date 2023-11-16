import { Fragment, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export default function Game() {
  const [socketIO, setSocketIO] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5536");
    setSocketIO(socket);
  }, []);

  return (
    <Fragment>
      <h1>GAME</h1>
    </Fragment>
  );
}
