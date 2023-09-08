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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	var Gun =
		"undefined" != typeof __usable_globalThis.GUN
			? __usable_globalThis.GUN || {
					chain: {},
			  }
			: gunPlugin(__usable_environment);
	Gun.chain.then = function (cb, opt) {
		var gun = this;

		var p = new Promise((res) => {
			gun.once(res, opt);
		});

		return cb ? p.then(cb) : p;
	};
}
