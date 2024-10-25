import { Server } from "colyseus";
import http from "http";
import express from "express";
import path from "path";
import basicAuth from "express-basic-auth";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";


import { GameRoom } from "./rooms/GameRoom";

export const port = Number(process.env.PORT || 2567);
export const endpoint = "localhost";

export let STATIC_DIR: string;

const app = express();
const gameServer = new Server({
  server: http.createServer(app),
});

gameServer.define("GameRoom", GameRoom);

app.use("/", express.static(path.resolve(__dirname, "public")));

// add colyseus monitor
const auth = basicAuth({ users: { 'admin': 'admin' }, challenge: true });
app.use("/colyseus", auth, monitor());

if (process.env.NODE_ENV !== "production") {
  app.use("/", playground);
}

gameServer.listen(port);
console.log(`Listening on http://${endpoint}:${port}`);