import fs from "fs-extra";

await fs.copy("node_modules/gun", "gunSource");
fs.copy("gunSource/as.js",	"as.js");
fs.copy("gunSource/axe.js", "axe.js");
fs.copy("gunSource/gun.js", "gun.js");
fs.copy("gunSource/nts.js", "nts.js");
fs.copy("gunSource/sea.js", "sea.js");
fs.copy("gunSource/lib",	"lib");
fs.copy("gunSource/index.d.ts",	"index.d.ts");
fs.copy("gunSource/types",	"types");
