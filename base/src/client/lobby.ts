import { $, $$, $make, $remove } from "./helpers";
import { socket } from "./index";

import { RoomListEntry } from "../server/rooms";

const createRoomFormElt = $(".lobby .createRoom form") as HTMLFormElement;
createRoomFormElt.addEventListener("submit", onCreateRoomFormSubmit);

const createRoomNameElt = $(".lobby .createRoom input[name=roomName]") as HTMLInputElement;

const roomsListElt = $(".lobby .live.rooms tbody") as HTMLTableSectionElement;
roomsListElt.addEventListener("click", onRoomListClick);
let liveRooms: RoomListEntry[];
const liveRoomNames: string[] = [];

const noLiveRoomsElt = $(".lobby .live.rooms .none");
const refreshElt = $(".lobby .refresh") as HTMLButtonElement;
refreshElt.addEventListener("click", onRefreshClick);

const recentRoomsJSON = localStorage.getItem("recentRooms");
const recentRoomNames: string[] = recentRoomsJSON != null ? JSON.parse(recentRoomsJSON) : [];

const recentRoomsElt = $(".lobby .recent.rooms");
const recentRoomsListElt = $(".lobby .recent.rooms tbody") as HTMLTableSectionElement;
recentRoomsListElt.addEventListener("click", onRoomListClick);

export function onEnter(rooms: RoomListEntry[]) {
  onRoomList(rooms);

  $(".loading").hidden = true;
  $(".lobby").hidden = false;
}

function onCreateRoomFormSubmit(this: HTMLFormElement, event: Event) {
  if (!this.checkValidity()) return;

  event.preventDefault();

  const roomName = createRoomNameElt.value.replace(/ /g, "_");

  joinRoom(roomName);
}

export function onRoomList(rooms: RoomListEntry[]) {
  liveRooms = rooms;

  refreshElt.disabled = false;
  refreshElt.textContent = refreshElt.dataset["enabled"]!;

  if (rooms.length === 0) {
    noLiveRoomsElt.hidden = false;
  } else {
    liveRoomNames.length = 0;
    for (const room of rooms) {
      liveRoomNames.push(room.name);
      makeRoomElement(room, roomsListElt);
    }
  }

  recentRoomsListElt.innerHTML = "";

  for (const roomName of recentRoomNames) {
    if (liveRoomNames.indexOf(roomName) !== -1) continue;
    makeRoomElement({ name: roomName, playerCount: 0 }, recentRoomsListElt);
  }

  recentRoomsElt.hidden = recentRoomsListElt.childElementCount === 0;
}

function makeRoomElement(room: RoomListEntry, parent: HTMLElement) {
  const row = $make("tr", undefined, { parent });
  row.dataset["roomName"] = room.name;

  const playerCountCell = $make("td", "playerCount", { parent: row });
  $make("div", undefined, { parent: playerCountCell, textContent: room.playerCount.toString() })
  $make("td", "roomName", { parent: row, textContent: room.name });
}

function onRoomListClick(event: MouseEvent) {
  let target = event.target as HTMLElement;

  while (target.tagName !== "TR") {
    if (target === event.currentTarget) return;
    target = target.parentElement!;
  }

  joinRoom(target.dataset["roomName"]!);
}

export function joinRoom(roomName: string) {
  const recentIndex = recentRoomNames.indexOf(roomName);
  if (recentIndex !== -1) recentRoomNames.splice(recentIndex, 1);
  recentRoomNames.unshift(roomName);
  if (recentRoomNames.length > 5) recentRoomNames.length = 5;
  localStorage.setItem("recentRooms", JSON.stringify(recentRoomNames));

  socket.emit("lobby:joinRoom", roomName);

  $(".lobby").hidden = true;
  $(".loading").hidden = false;
}

function onRefreshClick() {
  refreshElt.disabled = true;
  refreshElt.textContent = refreshElt.dataset["disabled"]!;

  roomsListElt.innerHTML = "";
  noLiveRoomsElt.hidden = true;
  recentRoomsElt.hidden = true;

  socket.emit("lobby:getRoomsList", onRoomList);
}
