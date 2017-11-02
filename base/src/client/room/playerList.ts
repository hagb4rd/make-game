import { $, $$, $make } from "../helpers";
import { socket } from "../index";
import * as chat from "./chat";

import { LobbySocketPublicData } from "../../server/lobby";

socket.on("room:addPlayer", onRoomAddPlayer);
socket.on("room:removePlayer", onRoomRemovePlayer);

let playerCount = 0;

const playerListButtonElt = $(`.side .buttons div[data-tab="playerList"]`) as HTMLDivElement;

export function onRoomPlayerList(players: LobbySocketPublicData[]) {
  for (const player of players) addPlayer(player.playerId, player.playerName!);

  setPlayerCount(players.length);
}

function setPlayerCount(count: number) {
  playerCount = count;
  playerListButtonElt.textContent = `Players (${playerCount})`;
}

function onRoomAddPlayer(playerId: string, playerName: string) {
  chat.append(`${playerName}#${playerId} joined.`);
  addPlayer(playerId, playerName);

  setPlayerCount(playerCount + 1);
}

function addPlayer(playerId: string, playerName: string) {
  const elt = $make("div", undefined, { parent: $(".playerList"), textContent: `${playerName}#${playerId}` });
  elt.dataset["playerId"] = playerId;
}

function onRoomRemovePlayer(playerId: string) {
  const elt = $(`.playerList div[data-player-id="${playerId}"]`);
  elt.parentElement.removeChild(elt);

  setPlayerCount(playerCount - 1);
}

