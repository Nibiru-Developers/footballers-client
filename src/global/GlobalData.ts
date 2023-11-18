import { atom } from "jotai";
import { Socket } from "socket.io-client";
import cryptoRandomString from "crypto-random-string";
import { UserType } from "../types/User";
import { QuestionType } from "../types/Question";
import { ScoreType } from "../types/Score";

export const onlineStatusLoadingAtom = atom<boolean>(false);
export const onlineStatusAtom = atom<boolean>(false);

export const userIdAtom = atom<string>(cryptoRandomString({ length: 10 }));
export const userNameAtom = atom<string>("");
export const roomIdAtom = atom<string>("");

export const socketConnectionAtom = atom<Socket | null>(null);
export const usersOnlineAtom = atom<UserType[]>([]);

export const waitingStatusLoadingAtom = atom<boolean>(false);
export const playingAtom = atom<boolean>(false);
export const timeRemainingAtom = atom<number>(0);
export const questionsAtom = atom<QuestionType[]>([]);
export const scoresAtom = atom<ScoreType[]>([]);
