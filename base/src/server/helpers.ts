import { LobbySocket } from "./lobby";

export function log(this: LobbySocket, functionName: string, message: string) {
  let playerIdentifier = this.lobbyData.pub.playerName;
  if (playerIdentifier != null) playerIdentifier += ` (${this.id})`;
  else playerIdentifier = this.id;

  console.log(`${functionName}> ${playerIdentifier} - ${message}`);
}

export function fail(this: LobbySocket, functionName: string, message: string) {
  log.call(this, functionName, `FAIL: ${message}`);
  this.disconnect();
}

export function validateStringParameterMinMax(this: LobbySocket, functionName: string, parameterName: string, value: string, minLength: number, maxLength: number) {
  if (typeof(value) !== "string") { fail.call(this, functionName, `${parameterName} must be a string.`); return false; }
  if (value.length < minLength || value.length > maxLength) { fail.call(this, functionName, `${parameterName} must be between ${minLength} to ${maxLength} characters long.`); return false; }

  return true;
}

export function validateStringParameterRegex(this: LobbySocket, functionName: string, parameterName: string, value: string, regex: RegExp) {
  if (typeof(value) !== "string") { fail.call(this, functionName, `${parameterName} must be a string.`); return false; }
  if (!regex.test(value)) { fail.call(this, functionName, `${parameterName} must match regex.`); return false; }

  return true;
}

export function validateHasPlayerName(this: LobbySocket, functionName: string) {
  if (this.lobbyData.pub.playerName == null) { fail.call(this, functionName, "Must have player name setup."); return false; }

  return true;
}

export function getRoomOrFail(this: LobbySocket, functionName: string) {
  if (this.lobbyData.roomName == null) { fail.call(this, functionName, "Must be in a room."); return null; }

  return this.rooms[this.lobbyData.roomName];
}
