import gunPlugin from "../gun.js";
import radixPlugin from "./radix.js";
let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
	__usable_isActivated = true;
	const __usable_globalThis = new Proxy(
		"window" in globalThis ? window : globalThis,
		{
			get(target, property) {
				if (["window", "globalThis", "global"].includes(property)) {
					return __usable_globalThis;
				} else if (__usable_environment.library[property] !== undefined) {
					return __usable_environment.library[property];
				} else if ("window" in globalThis) {
					return window[property];
				} else {
					return globalThis[property];
				}
			},
			set(object, property, value) {
				__usable_environment.library[property] = value;
				return true;
			},
		},
	);
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
	(() => {
		var Gun =
			typeof __usable_window !== "undefined"
				? __usable_window.Gun
				: gunPlugin(__usable_environment);
		var Rad = (Gun.window || {}).Radix || radixPlugin(__usable_environment);
		/// Store the subscribes
		Gun.subs = Rad();
		function input(msg) {
			var at = this.as;
			var to = this.to;
			var peer = (msg._ || empty).via;
			var get = msg.get;
			var soul;
			var key;
			if (!peer || !get) {
				return to.next(msg);
			}
			// console.log("super", msg);
			if ((soul = get["#"])) {
				if ((key = get["."])) {
				}
				if (!peer.id) {
					__usable_globalThis.debug.log("[*** WARN] no peer.id %s", soul);
				}
				var subs = Gun.subs(soul) || null;
				var tmp = subs ? subs.split(",") : [];
				var p = at.opt.peers;
				if (subs) {
					Gun.obj.map(subs.split(","), (peerid) => {
						if (peerid in p) {
							tmp.push(peerid);
						}
					});
				}
				if (tmp.indexOf(peer.id) === -1) {
					tmp.push(peer.id);
				}
				tmp = tmp.join(",");
				Gun.subs(soul, tmp);
				var dht = {};
				dht[soul] = tmp;
				at.opt.mesh.say(
					{
						dht,
					},
					peer,
				);
			}
			to.next(msg);
		}
		var empty = {};
		if (Gun.window) {
			return;
		}
		try {
			__usable_module.exports = input;
		} catch (e) {}
	})();
	__usable_environment.exports.lib.super = __usable_module.exports;
	return __usable_module.exports;
}
