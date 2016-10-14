import * as SocketIO from "socket.io";
import * as express from "express";
import * as http from "http";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server, { transports: [ "websocket" ]});

app.use("/", express.static(`${__dirname}/../public`));

server.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}.`);

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}.`);
  });
});
