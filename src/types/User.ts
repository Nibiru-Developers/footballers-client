import { Socket } from "socket.io-client";

export type UserType = {
  socketId: Socket;
  userId: string;
  userName: string;
};