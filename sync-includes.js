/* Regenerate js/include-fallback.js after editing Header.html or Footer.html */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const files = ["Header.html", "Footer.html"];
const out = {};

for (const file of files) {
  out[file] = fs.readFileSync(path.join(root, file), "utf8");
}

const js =
  "/* Auto-generated — run: node sync-includes.js */\n" +
  "window.__INCLUDE_FALLBACK = " +
  JSON.stringify(out, null, 2) +
  ";\n";

fs.writeFileSync(path.join(root, "js", "include-fallback.js"), js, "utf8");
console.log("Updated js/include-fallback.js");
