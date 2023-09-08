import rootPlugin from "./root.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
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
	/* BEGIN WRAPPED GUN CODE */

	var SEA = rootPlugin(__usable_environment);
	try {
		if (SEA.window) {
			if (
				location.protocol.indexOf("s") < 0 &&
				location.host.indexOf("localhost") < 0 &&
				!/^127\.\d+\.\d+\.\d+$/.test(location.hostname) &&
				location.protocol.indexOf("file:") < 0
			) {
				__usable_globalThis.debug.error(
					"SEA needs to run in a secure context (HTTPS) to run cryptographic operations.",
				);
				// WebCrypto does NOT work without HTTPS!
			}
		}
	} catch (e) {}
}
