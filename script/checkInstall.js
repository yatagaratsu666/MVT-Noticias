const fs = require("fs");
const { execSync } = require("child_process");

if (!fs.existsSync("node_modules")) {
  console.log("¿Y las dependencias?, ya las instalo...");
  execSync("npm install", { stdio: "inherit" });
} else {
  console.log("Dependencias ya instaladas, ejecutando entorno :3");
}
