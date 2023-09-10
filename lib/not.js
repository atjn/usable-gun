import gunPlugin from "../gun.js";
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

	if (typeof __usable_window !== "undefined") {
		var Gun = __usable_window.Gun;
	} else {
		var Gun = gunPlugin(__usable_environment);
	}
	Gun.chain.not = function (cb) {
		return this.get(ought, {
			not: cb,
		});
	};
	function ought(at, ev) {
		ev.off();
		if (at.err || undefined !== at.put) {
			return;
		}
		if (!this.not) {
			return;
		}
		this.not.call(at.gun, at.get, () => {
			__usable_globalThis.debug.log(
				"Please report this bug on https://gitter.im/amark/gun and in the issues.",
			);
			__usable_globalThis.need.to.implement;
		});
	}
}
