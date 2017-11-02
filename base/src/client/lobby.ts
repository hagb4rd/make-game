import { $, $$, $make, $remove } from "./helpers";
import { socket } from "./index";

import { RoomListEntry } from "../server/rooms";

const createRoomFormElt = $(".lobby .createRoom form") as HTMLFormElement;
createRoomFormElt.addEventListener("submit", onCreateRoomFormSubmit);

const createRoomNameElt = $(".lobby .createRoom input[name=roomName]") as HTMLInputElement;
// const unlistedElt = $(".lobby .createRoom input[name=unlisted]") as HTMLInputElement;

const roomsListElt = $(".lobby .rooms tbody") as HTMLTableSectionElement;
roomsListElt.addEventListener("click", onRoomListClick);

const noRoomsElt = $(".lobby .rooms .none");
const refreshElt = $(".lobby .refresh") as HTMLButtonElement;
refreshElt.addEventListener("click", onRefreshClick);

export function onEnter(rooms: RoomListEntry[]) {
  onRoomList(rooms);

  $(".loading").hidden = true;
  $(".lobby").hidden = false;
}

export function onRoomList(rooms: RoomListEntry[]) {
  refreshElt.disabled = false;
  refreshElt.textContent = refreshElt.dataset["enabled"]!;

  if (rooms.length === 0) {
    noRoomsElt.hidden = false;
    return;
  }

  for (const room of rooms) {
    const row = $make("tr", undefined, { parent: roomsListElt });
    row.dataset["roomName"] = room.name;

    const playerCountCell = $make("td", "playerCount", { parent: row });
    $make("div", undefined, { parent: playerCountCell, textContent: room.playerCount.toString() })
    $make("td", "roomName", { parent: row, textContent: room.name });
  }
}

function onRoomListClick(event: MouseEvent) {
  let target = event.target as HTMLElement;

  while (target.tagName !== "TR") {
    if (target === event.currentTarget) return;
    target = target.parentElement!;
  }

  joinRoom(target.dataset["roomName"]!);
}

function onCreateRoomFormSubmit(this: HTMLFormElement, event: Event) {
  if (!this.checkValidity()) return;

  event.preventDefault();

  const roomName = createRoomNameElt.value.replace(/ /g, "_");
  // const unlisted = unlistedElt.checked;

  joinRoom(roomName);
}

function joinRoom(roomName: string) {
  socket.emit("lobby:joinRoom", roomName);

    $(".lobby").hidden = true;
    $(".loading").hidden = false;
  }

function onRefreshClick() {
  refreshElt.disabled = true;
  refreshElt.textContent = refreshElt.dataset["disabled"]!;

  roomsListElt.innerHTML = "";
  noRoomsElt.hidden = true;

  socket.emit("lobby:getRoomsList", onRoomList);
}
