import gunPlugin from "../gun.js";
import openPlugin from "./open.js";
import byePlugin from "./bye.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
	__usable_isActivated = true;
	const __usable_window =
		__usable_environment.environmentHint !== "browser"
			? undefined
			: new Proxy("window" in globalThis ? window : globalThis, {
					get(target, property) {
						if (["window", "globalThis", "global"].includes(property)) {
							return __usable_window;
						} else if (__usable_environment.library[property] !== undefined) {
							return __usable_environment.library[property];
						} else if ("window" in globalThis) {
							return window[property];
						} else {
							return undefined;
						}
					},
					set(object, property, value) {
						__usable_environment.library[property] = value;
						return true;
					},
			  });
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	var Gun =
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment);
	Gun.chain.open || openPlugin(__usable_environment);
	var _on = Gun.chain.on;
	Gun.chain.on = function (a, b, c) {
		if ("value" === a) {
			return this.open(b, c);
		}
		return _on.call(this, a, b, c);
	};
	Gun.chain.bye || byePlugin(__usable_environment);
	Gun.chain.onDisconnect = Gun.chain.bye;
	Gun.chain.connected = function (cb) {
		var root = this.back(-1);
		var last;
		root.on("hi", (peer) => {
			if (!cb) {
				return;
			}
			cb((last = true), peer);
		});
		root.on("bye", (peer) => {
			if (!cb || last === peer) {
				return;
			}
			cb(false, (last = peer));
		});
		return this;
	};
}
