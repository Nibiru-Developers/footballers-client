import { atom } from "jotai";
import { Socket } from "socket.io-client";
import cryptoRandomString from "crypto-random-string";
import { UserOnlineType } from "../types/User";

export const OnlineStatusLoadingAtom = atom<boolean>(false);
export const onlineStatusAtom = atom<boolean>(false);
export const userIdAtom = atom<string>(cryptoRandomString({ length: 10 }));
export const userNameAtom = atom<string>("");
export const socketConnectionAtom = atom<Socket | null>(null);
export const usersOnlineAtom = atom<UserOnlineType[]>([]);
