import * as SocketIO from "socket.io";
import * as express from "express";
import * as http from "http";
import * as path from "path";
import * as lobby from "./lobby";

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
export const io = SocketIO(server, { transports: [ "websocket" ]});

const publicPath = path.resolve(`${__dirname}/../../public`);
app.use("/", express.static(publicPath));

app.get("/play/:room", (req, res) => {
  if (!lobby.nameRegex.test(req.params.room)) { res.send(400); return; }
  res.sendFile(path.join(publicPath, "index.html"));
});

server.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});

io.on("connection", lobby.onConnection);
