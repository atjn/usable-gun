import { GunEnvironment } from "./usableLib/GunEnvironment.js";
import { NoDebugger, ConsoleDebugger, StoreDebugger } from "./usableLib/debuggers.js";
import defaultGunPlugin from "./gun.js";
import defaultSeaPlugin from "./sea.js";
import defaultAxePlugin from "./axe.js";
import basicGunPlugin from "./src/index.js";
import basicSeaPlugin from "./sea/index.js";

const defaultBrowserPlugin = defaultGunPlugin;

export {
	GunEnvironment,

	basicGunPlugin,
	basicSeaPlugin,
	defaultGunPlugin,
	defaultSeaPlugin,
	defaultAxePlugin,
	defaultBrowserPlugin,
	
	NoDebugger,
	ConsoleDebugger,
	StoreDebugger,
};
