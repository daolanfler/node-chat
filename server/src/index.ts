/// <reference path="../shims.d.ts" />
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import { getName } from "random_chinese_fantasy_names";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const idNameMap = new Map<string, string>();

io.on("connection", (socket) => {
  idNameMap.set(socket.id, getName(1)[0]);
  const name = idNameMap.get(socket.id);
  console.log("---- connected ----", name);

  socket.emit("connected", {
    name,
    memberList: [...idNameMap].map(([key, value]) => {
      return {
        name: value,
        id: key,
      };
    }),
  });

  socket.broadcast.emit("enter", {
    name,
    id: socket.id,
  });

  socket.on("message", (msg) => {
    console.log(msg, socket.id);
    socket.broadcast.emit("message", {
      socketId: socket.id,
      msg,
      name,
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
    idNameMap.delete(socket.id);
    io.emit("leave", socket.id);
  });
});

io.listen(6969);
