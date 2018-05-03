# make-game
Generate a Node.js + TypeScript + Express + Socket.IO multiplayer game project skeleton

Includes lobby, rooms, player list, chat, Web app manifest.

## How to use

Make sure you have the latest version of [Node.js](https://nodejs.org/en/) installed.

Clone this repository and run:

    node make-game your-project-name
    cd your-project-name

To continuously rebuild your game, run those two commands, each in their own terminal:

    npm run watch
    npm run watchify-client

To launch the server, run:

    npm start

Or open `src/server/index.ts` in [Visual Studio Code](https://code.visualstudio.com) and press F5 to get full debugging capabilities.

Navigate to `localhost:3000` to test your game.
