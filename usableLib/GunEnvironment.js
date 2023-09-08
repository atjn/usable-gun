import { ConsoleDebugger } from "./debuggers.js";

export class GunEnvironment{
	constructor(options = {}){
		if(options.iContributeToGun !== true){
			/**
			 * Please do not remove welcome log unless you are paying for a monthly sponsorship, thanks!
			 */
			console.log("Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");
		}

		this.#environment.environmentHint = options.environmentHint ?? "browser";
		if(!["browser", "server"].includes(this.#environment.environmentHint)) throw new TypeError(`GunEnvironment was expecting an environmentHint of value "browser" or "server", but got ${typeof this.#environment.environmentHint}: ${this.#environment.environmentHint}`);

		/**
		 * Plugins should only be using `environment.debugger`.
		 * Some of the wrapped Gun code is complicated and needs the `environment.library.debugger` entry.
		 */
		this.#environment.debug = options.debug || new ConsoleDebugger({ enable: ["warn", "error"] });
		this.#environment.library.debug = this.#environment.debug;

		if("window" in globalThis) this.#environment.library.debug.warn("Gun should not be running on main thread, it can make your website freeze randomly!");
	}

	async usePlugins(plugins){
		if(!Array.isArray(plugins)) throw new TypeError(`GunEnvironment was expecting to use an array of plugins, but got ${typeof plugins}: ${plugins}`);
		for(const plugin of plugins){
			await plugin(this.#environment);
		}
	}

	#environment = {
		exports: {
			default: {},
			gun: {},
			sea: {},
			lib: {
				meta: {},
				text_encoding: {},
			},
		},
		library: {},
	};
	get environmentHint(){
		return this.#environment.environmentHint;
	}
	get debug(){
		return this.#environment.debug;
	}
	get exports(){
		return this.#environment.exports;
	}
	get library(){
		return this.#environment.library;
	}

}
