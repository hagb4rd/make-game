import { $, $$, $make, $remove } from "../helpers";
import { socket } from "../index";

import { PublicRoom } from "../../server/rooms";

import * as playerList from "./playerList";
import * as chat from "./chat";

const gameName = document.title;

socket.on("room:data", onRoomData);

const sideElt = $(".room .side") as HTMLElement;
sideElt.hidden = matchMedia("(max-width: 800px)").matches;

($(".room .side .buttons") as HTMLElement).addEventListener("click", onSideButtonsClick);
($(".toggleSide") as HTMLElement).addEventListener("click", onToggleSide);

window.addEventListener("popstate", onWindowPopState);

function onRoomData(data: PublicRoom) {
  $(".loading").hidden = true;
  $(".room").hidden = false;

  window.history.pushState(null, `${data.name} — ${gameName}`, `/play/${data.name}`);

  playerList.onRoomPlayerList(data.playerList);
}

function onWindowPopState(event: PopStateEvent) {
  window.location.assign("/");
}

function onSideButtonsClick(event: MouseEvent) {
  const target = event.target as HTMLDivElement;

  if (target.classList.contains("home")) {
    window.location.assign("/");
    return;
  }

  const tabName = target.dataset["tab"];

  $(".room .side .buttons > div.active").classList.remove("active");
  target.classList.add("active");

  $(".room .side .tabs > div:not([hidden])").hidden = true;
  const tabElt = $(".room .side .tabs").querySelector(`.${tabName}`).hidden = false;
}

function onToggleSide(event: MouseEvent) {
  event.preventDefault();

  sideElt.hidden = !sideElt.hidden;
}