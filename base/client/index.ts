/// <reference path="../typings/browser.d.ts" />

import * as io from "socket.io-client";

const socket = io.connect(null, { transports: [ "websocket" ] });
