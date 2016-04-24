"use strict";

const fs = require("fs");

function copy(filepath, src, dest) {
  const srcPath = (filepath === ".") ? src : (src + "/" + filepath);
  const info = fs.lstatSync(srcPath);
  if (info.isDirectory()) {
    try { fs.mkdirSync(`${dest}/${filepath}`); } catch (err) { if (err.code !== "EEXIST") throw err; }
    const entries = fs.readdirSync(srcPath);
    for (const entry of entries) copy(`${filepath}/${entry}`, src, dest);
  } else {
    fs.writeFileSync(`${dest}/${filepath}`, fs.readFileSync(srcPath));
  }
}

const projectName = process.argv[2];
if (projectName == null) {
  console.log("Project name required");
  process.exit(1);
}

const execSync = require("child_process").execSync;

execSync(`mkdir ${projectName}`);
process.chdir(`${process.cwd()}/${projectName}`);
execSync("npm init -y");

copy(".", `${__dirname}/base`, process.cwd());

execSync("npm install express socket.io --save");
execSync("npm install socket.io-client typescript watchify --save-dev");

const pkg = JSON.parse(fs.readFileSync("package.json", { encoding: "utf8" }));
pkg.scripts = {
  "build": "npm run build-server && npm run build-client",
  "build-server": "tsc -p server",
  "build-client": "tsc -p client && browserify client/index.js -o public/index.js",
  "watch-server": "tsc -w -p server",
  "watch-client": "tsc -w -p client",
  "watchify-client": "watchify client/index.js -o public/index.js",
  "start": "node server"
};
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

execSync("typings install node --ambient --save");
execSync("typings install express --ambient --save");
execSync("typings install serve-static --ambient --save");
execSync("typings install express-serve-static-core --ambient --save");
execSync("typings install mime --ambient --save");
execSync("typings install socket.io --ambient --save");
execSync("typings install socket.io-client --ambient --save");

execSync("npm run build");
