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
	/* BEGIN WRAPPED GUN CODE */
	__usable_globalThis.debug.warn(
		"The `TextEncoder` and `TextDecoder` methods are available in all modern environments, no need to polyfill them.",
	);
	__usable_module.exports = {
		TextEncoder,
		TextDecoder,
	};
	__usable_environment.exports.lib.text_encoding.index =
		__usable_module.exports;
	return __usable_module.exports;
}
