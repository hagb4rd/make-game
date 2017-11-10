import { $, $$, $make, $remove } from "./helpers";
import * as io from "socket.io-client";

export const socket = io.connect({ transports: [ "websocket" ], reconnection: false });

export let username = window.localStorage.getItem("username");

import * as setupUsername from "./setupUsername";
import * as lobby from "./lobby";
import "./room";

socket.on("disconnect", onDisconnect);

export function setUsername(newUsername: string) {
  username = newUsername;
  localStorage.setItem("username", username);
  socket.emit("lobby:setName", username);
}

export function route() {
  if (window.location.pathname.startsWith("/play/")) {
    if (username == null) {
      setupUsername.show();
      return;
    }

    socket.emit("lobby:setName", username);
    const roomName = window.location.pathname.substring("/play/".length);
    lobby.joinRoom(roomName);
  } else {
    if (username == null) username = "Guest";

    socket.emit("lobby:setName", username);
    socket.emit("lobby:getRoomsList", lobby.onEnter);
  }
}

function onDisconnect() {
  document.body.innerHTML = `<div class="disconnected big">Whoops, you got disconnected. Please reload the page.</div>`;
}

route();
