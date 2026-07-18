/* Regenerate js/include-fallback.js after editing Header.html or Footer.html */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
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
