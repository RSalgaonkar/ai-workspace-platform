import http from "http";

import { Server } from "socket.io";

import app from "./app";

const server =
  http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:3000",

    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log(
    "User connected:",
    socket.id
  );

  socket.on(
    "join-workspace",
    (workspaceId: string) => {
      socket.join(workspaceId);
    }
  );

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );
  });
});

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});