import { remove } from "fs-extra";
import { sourceDir, rebuiltDir, rebuiltGunSrc } from "./setup.js";

remove(sourceDir);
remove(rebuiltGunSrc);
remove(new URL("src/", rebuiltDir));
remove(new URL("sea/", rebuiltDir));
remove(new URL("lib/", rebuiltDir));
remove(new URL("as.js", rebuiltDir));
remove(new URL("axe.js", rebuiltDir));
remove(new URL("gun.js", rebuiltDir));
remove(new URL("nts.js", rebuiltDir));
remove(new URL("sea.js", rebuiltDir));

remove(new URL("reports/", rebuiltDir));
