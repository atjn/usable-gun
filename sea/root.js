let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment, __usable_MODULE) {
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
	/* BEGIN WRAPPED GUN CODE */

	// Security, Encryption, and Authorization: SEA.js
	// MANDATORY READING: https://gun.eco/explainers/data/security.html
	// IT IS IMPLEMENTED IN A POLYFILL/SHIM APPROACH.
	// THIS IS AN EARLY ALPHA!
	if (typeof __usable_globalThis !== "undefined") {
		__usable_module.window = __usable_globalThis;
	} // should be safe for at least browser/worker/nodejs, need to check other envs like RN etc.
	if (typeof __usable_window !== "undefined") {
		__usable_module.window = __usable_window;
	}
	var tmp = __usable_module.window || __usable_module;
	var SEA = tmp.SEA || {};
	if ((SEA.window = __usable_module.window)) {
		SEA.window.SEA = SEA;
	}
	try {
		if ("undefined" !== typeof __usable_MODULE) {
			__usable_MODULE.exports = SEA;
		}
	} catch (e) {}
	__usable_module.exports = SEA;
	__usable_environment.exports.sea.root = __usable_module.exports;
	return __usable_module.exports;
}
