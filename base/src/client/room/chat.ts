import { $, $$, $make, $remove } from "../helpers";
import { socket } from "../index";

socket.on("room:chat", onRoomChat);

const maxHistory = 100;
const logElt = $(".chat .log") as HTMLDivElement;
const textAreaElt = $(".chat .input textarea") as HTMLTextAreaElement;
textAreaElt.addEventListener("keydown", onChatInputKeydown);

export function append(text: string) {
  const wasScrolledToBottom = isLogScrolledToBottom();

  $make("div", undefined, { parent: logElt, textContent: text });

  if (wasScrolledToBottom) {
    logElt.scrollTop = logElt.scrollHeight;
    if (logElt.childElementCount > maxHistory) $remove(logElt.querySelector("div:first-of-type") as HTMLElement);
  }
}

function isLogScrolledToBottom() {
  return logElt.scrollTop >= logElt.scrollHeight - logElt.clientHeight - 15;
}

function onRoomChat(playerId: string, playerName: string, message: string) {
  append(`${playerName}#${playerId}: ${message}`);
}

function onChatInputKeydown(this: HTMLTextAreaElement, event: KeyboardEvent) {
  if (event.keyCode == 13 && !event.shiftKey) {
    if (this.value.length > 0) {
      socket.emit("room:chat", this.value);
      this.value = "";
    }
    event.preventDefault();
  }
}
