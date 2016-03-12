/// <reference path="../typings/browser.d.ts" />

import * as io from "socket.io-client";

const socket = io.connect(null, { transports: [ "websocket" ], reconnection: false });

socket.on("disconnect", onDisconnect);

function onDisconnect() {
  document.body.innerHTML = "Whoops, you have been disconnected. Plz reload the page.";
}
