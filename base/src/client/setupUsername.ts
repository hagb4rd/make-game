import { $, $$, $make, $remove } from "./helpers";
import { username, setUsername, route } from "./index";

const usernameForm = $(".setupUsername form") as HTMLFormElement;
usernameForm.addEventListener("submit", onFormSubmit);

const usernameInputElt = $(".setupUsername input") as HTMLInputElement;

export function show() {
  $(".setupUsername").hidden = false;
  $(".loading").hidden = true;

  if (username != null) usernameInputElt.value = username;
  usernameInputElt.focus();
  usernameInputElt.select();
}

function onFormSubmit(this: HTMLFormElement, event: Event) {
  if (!this.checkValidity()) return;

  event.preventDefault();

  $(".setupUsername").hidden = true;
  $(".loading").hidden = false;

  setUsername(usernameInputElt.value.replace(/ /g, "_"));
  route();
}
