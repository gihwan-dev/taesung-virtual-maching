import { io } from "socket.io-client";

const URL = "/ws";

export const socket = io(URL);
