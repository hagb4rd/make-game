import { LobbySocket, LobbySocketPublicData } from "./lobby";
import * as helpers from "./helpers";
import { io } from "./index";
import * as _ from "lodash";

interface RoomData {
  room: Room;
}

interface RoomSocket extends LobbySocket {
  roomData: RoomData;
}

export interface RoomListEntry {
  name: string;
  playerCount: number;
}

export const byName: { [roomName: string]: Room } = {};
export const sortedByPlayerCount: RoomListEntry[] = [];

export function createRoom(roomName: string, socket: LobbySocket) {
  const room =  new Room(roomName);

  byName[roomName] = room;

  const index = _.sortedIndexBy(sortedByPlayerCount, room.entry, (x) => -x.playerCount);
  sortedByPlayerCount.splice(index, 0, room.entry);

  return room;
}

export interface PublicRoom {
  name: string;
  playerList: LobbySocketPublicData[];
}

class Room {
  pub: PublicRoom;
  entry: RoomListEntry;

  constructor(roomName: string) {
    this.pub = { name: roomName, playerList: [] };
    this.entry = { name: roomName, playerCount: 0 };
  }

  emit(event: string | symbol, ...args: any[]) {
    const namespace = io.to(`room:${this.pub.name}`);
    namespace.emit.apply(namespace, arguments);
  }

  onPlayerAdded(socket: LobbySocket) {
    (socket as RoomSocket).roomData = { room: this };

    socket.on("room:chat", onChat);
    this.pub.playerList.push(socket.lobbyData.pub);

    this.entry.playerCount++;
    sortedByPlayerCount.sort((x) => -x.playerCount);

    this.emit("room:addPlayer", socket.lobbyData.pub.playerId, socket.lobbyData.pub.playerName);
    socket.emit("room:data", this.pub);
  }

  onPlayerRemoved(socket: LobbySocket) {
    delete (socket as RoomSocket).roomData;

    this.pub.playerList.splice(this.pub.playerList.indexOf(socket.lobbyData.pub), 1);
    this.entry.playerCount--;

    if (this.pub.playerList.length === 0) {
      delete byName[this.pub.name];
      sortedByPlayerCount.splice(sortedByPlayerCount.indexOf(this.entry), 1);
      return;
    }

    sortedByPlayerCount.sort((x) => -x.playerCount);

    this.emit("room:removePlayer", socket.lobbyData.pub.playerId);
  }
}

function onChat(this: RoomSocket, message: string) {
  if (!helpers.validateStringParameterMinMax.call(this, onChat.name, "message", message, 1, 300)) return;

  this.roomData.room.emit("room:chat", this.lobbyData.pub.playerId, this.lobbyData.pub.playerName, message);
}
