import { Socket } from "socket.io-client";

export type UserOnlineType = {
  socketId: Socket;
  userId: string;
  userName: string;
};