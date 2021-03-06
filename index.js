"use strict";

const fs = require("fs");

function replaceVars(text) {
  return text
    .replace(/\$\$\$GAME_NAME\$\$\$/g, projectName)
    .replace(/\$\$\$GAME_DESCRIPTION\$\$\$/g, "A multiplayer game.");
}

function copy(filepath, src, dest) {
  console.log(`Copying: ${filepath} to ${dest}`);
  const srcPath = (filepath === ".") ? src : (src + "/" + filepath);
  const info = fs.lstatSync(srcPath);
  if (info.isDirectory()) {
    try { fs.mkdirSync(`${dest}/${filepath}`); } catch (err) { if (err.code !== "EEXIST") throw err; }
    const entries = fs.readdirSync(srcPath);
    for (const entry of entries) copy(`${filepath}/${entry}`, src, dest);
  } else {
    if (srcPath.endsWith(".html") || srcPath.endsWith(".ts") || srcPath.endsWith(".json")) fs.writeFileSync(`${dest}/${filepath}`, replaceVars(fs.readFileSync(srcPath, "utf8")));
    else fs.writeFileSync(`${dest}/${filepath}`, fs.readFileSync(srcPath));
  }
}

const projectName = process.argv[2];
if (projectName == null) {
  console.log("Project name required");
  process.exit(1);
}

const actualExecSync = require("child_process").execSync;
function execSync(command) {
  console.log(`Running: ${command}`);
  actualExecSync(command);
}

execSync(`mkdir ${projectName}`);
process.chdir(`${process.cwd()}/${projectName}`);
execSync("npm init -y");

copy(".", `${__dirname}/base`, process.cwd());

execSync("npm install express socket.io socket.io-client typescript browserify watchify lodash");

const pkg = JSON.parse(fs.readFileSync("package.json", { encoding: "utf8" }));
pkg.scripts = {
  "build": "tsc -p src",
  "watch": "tsc -w -p src",
  "browserify-client": "browserify src/client/index.js -o public/index.js",
  "watchify-client": "watchify src/client/index.js -o public/index.js",
  "start": "node src/server"
};
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

execSync("npm install @types/node");
execSync("npm install @types/express @types/serve-static @types/express-serve-static-core @types/mime");
execSync("npm install @types/socket.io @types/socket.io-client @types/lodash");

execSync("npm run build");

execSync("git init");
execSync(`git add .`);
execSync(`git commit -m "Initial project structure"`);
