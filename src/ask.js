import mathRandomPlugin from "./../usableLib/mathRandomPlugin.js";
import ontoPlugin from "./onto.js";
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
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */ // request / response module, for asking and acking messages.
	mathRandomPlugin(__usable_environment);
	ontoPlugin(__usable_environment); // depends upon onto!
	__usable_module.exports = function (cb, as) {
		if (!this.on) {
			return;
		}
		var lack = (this.opt || {}).lack || 9000;
		if (!("function" == typeof cb)) {
			if (!cb) {
				return;
			}
			var id = cb["#"] || cb;
			var tmp = (this.tag || "")[id];
			if (!tmp) {
				return;
			}
			if (as) {
				tmp = this.on(id, as);
				clearTimeout(tmp.err);
				tmp.err = setTimeout(() => {
					tmp.off();
				}, lack);
			}
			return true;
		}
		var id = (as && as["#"]) || random(9);
		if (!cb) {
			return id;
		}
		var to = this.on(id, cb, as);
		to.err =
			to.err ||
			setTimeout(() => {
				to.off();
				to.next({
					err: "Error: No ACK yet.",
					lack: true,
				});
			}, lack);
		return id;
	};
	var random =
		__usable_globalThis.stringRandom ||
		(() => __usable_globalThis.mathRandom().toString(36).slice(2));
	__usable_environment.exports.gun.ask = __usable_module.exports;
	return __usable_module.exports;
}
