import { io } from "./index";
import * as helpers from "./helpers";
import * as rooms from "./rooms";

export const nameRegex = /^[A-Za-z0-9_]{1,20}$/;

export const settings = {
  publicPlayerList: true
};

export interface LobbySocketPublicData {
  playerId: string;
  playerName?: string;
}

interface LobbySocketData {
  pub: LobbySocketPublicData;
  roomName?: string;
}

export interface LobbySocket extends SocketIO.Socket {
  lobbyData: LobbySocketData;
}

let nextPlayerId = 0;

export function onConnection(socket: LobbySocket) {
  socket.lobbyData = { pub: { playerId: (nextPlayerId++).toString() } };

  helpers.log.call(socket, onConnection.name, "Connected.");

  socket.on("disconnect", onDisconnection);
  socket.on("lobby:getRoomsList", onGetRoomsList);
  socket.on("lobby:setName", onSetName);
  socket.on("lobby:joinRoom", onJoinRoom);
}

function onDisconnection(this: LobbySocket) {
  if (this.lobbyData.roomName != null) {
    const room = rooms.byName[this.lobbyData.roomName];

    room.onPlayerRemoved(this);
  }

  helpers.log.call(this, onDisconnection.name, "Disconnected.");
}

function onGetRoomsList(this: LobbySocket, callback: (rooms: rooms.RoomListEntry[]) => void) {
  callback(rooms.sortedByPlayerCount);
}

function onSetName(this: LobbySocket, playerName: string) {
  if (!helpers.validateStringParameterRegex.call(this, onSetName.name, "playerName", playerName, nameRegex)) return;
  if (this.lobbyData.roomName != null) { helpers.fail.call(this, onSetName.name, "Can't change name after joining room."); return; }

  this.lobbyData.pub.playerName = playerName;
}

function onJoinRoom(this: LobbySocket, roomName: string) {
  if (!helpers.validateStringParameterRegex.call(this, onJoinRoom.name, "roomName", roomName, nameRegex)) return;
  if (!helpers.validateHasPlayerName.call(this, onJoinRoom.name)) return;

  if (this.lobbyData.roomName != null) { helpers.fail.call(this, onJoinRoom.name, "Already in a room, can't join another one."); return; }

  let room = rooms.byName[roomName];
  if (room == null) room = rooms.createRoom(roomName, this);

  this.lobbyData.roomName = roomName;

  room.onPlayerAdded(this);
  this.join(`room:${roomName}`);

  helpers.log.call(this, onJoinRoom.name, `Joined room ${roomName}.`);
}
