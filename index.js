"use strict";

const fs = require("fs");

function copy(filepath, src, dest) {
  console.log(`Copying: ${filepath} to ${dest}`);
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

const actualExecSync = require("child_process").execSync;
function execSync(command) {
  console.log(`Running: ${command}`);
  actualExecSync(command);
}

execSync(`mkdir ${projectName}`);
process.chdir(`${process.cwd()}/${projectName}`);
execSync("yarn init -y");

copy(".", `${__dirname}/base`, process.cwd());

execSync("yarn add express socket.io socket.io-client typescript browserify watchify");

const pkg = JSON.parse(fs.readFileSync("package.json", { encoding: "utf8" }));
pkg.scripts = {
  "build": "tsc -p src",
  "watch": "tsc -w -p src",
  "browserify-client": "browserify src/client/index.js -o public/index.js",
  "watchify-client": "watchify src/client/index.js -o public/index.js",
  "start": "node src/server"
};
fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");

execSync("yarn add @types/node");
execSync("yarn add @types/express @types/serve-static @types/express-serve-static-core @types/mime");
execSync("yarn add @types/socket.io @types/socket.io-client");

execSync("yarn run build");

execSync("git init");
execSync(`git add .`);
execSync(`git commit -m "Initial project structure"`);
