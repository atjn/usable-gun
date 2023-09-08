let __usable_isActivated = false;
const __usable_module = {};
export default function (__usable_environment) {
	if (__usable_isActivated) return __usable_module.exports;
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

	function Nomem() {
		var opt = {};
		opt.put = (file, data, cb) => {
			cb(null, -9);
		}; // dev/null!
		opt.get = (file, cb) => {
			cb(null);
		};
		return opt;
	}
	if (typeof __usable_window !== "undefined") {
		__usable_window.Nomem = Nomem;
	} else {
		try {
			__usable_module.exports = Nomem;
		} catch (e) {}
	}
	__usable_environment.exports.lib.nomem = __usable_module.exports;
	return __usable_module.exports;
}
