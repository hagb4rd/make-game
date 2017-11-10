import { $, $$, $make, $remove } from "./helpers";
import * as io from "socket.io-client";

export const socket = io.connect({ transports: [ "websocket" ], reconnection: false });

import * as lobby from "./lobby";
import "./room";

socket.on("disconnect", onDisconnect);

socket.emit("lobby:setName", "Guest");

if (window.location.pathname.startsWith("/play/")) {
  const roomName = window.location.pathname.substring("/play/".length);

  lobby.joinRoom(roomName);
} else {
  socket.emit("lobby:getRoomsList", lobby.onEnter);
}

function onDisconnect() {
  document.body.innerHTML = `<div class="disconnected big">Whoops, you got disconnected. Please reload the page.</div>`;
}
