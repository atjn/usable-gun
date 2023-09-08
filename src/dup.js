import shimPlugin from "./shim.js";
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
	/* BEGIN WRAPPED GUN CODE */

	shimPlugin(__usable_environment);
	__usable_module.exports = (opt) => {
		var dup = {
			s: {},
		};

		var s = dup.s;
		opt = opt || {
			max: 999,
			age: 1000 * 9,
		}; //*/ 1000 * 9 * 3};
		dup.check = (id) => {
			if (!s[id]) {
				return false;
			}
			return dt(id);
		};
		var dt = (dup.track = (id) => {
			var it = s[id] || (s[id] = {});
			it.was = dup.now = +new Date();
			if (!dup.to) {
				dup.to = setTimeout(dup.drop, opt.age + 9);
			}
			if (dt.ed) {
				dt.ed(id);
			}
			return it;
		});
		dup.drop = (age) => {
			dup.to = null;
			dup.now = +new Date();
			var l = Object.keys(s);
			__usable_globalThis.debug.STAT &&
				__usable_globalThis.debug.STAT(
					dup.now,
					+new Date() - dup.now,
					"dup drop keys",
				); // prev ~20% CPU 7% RAM 300MB // now ~25% CPU 7% RAM 500MB
			__usable_globalThis.settimeoutEach(
				l,
				(id) => {
					var it = s[id]; // TODO: .keys( is slow?
					if (it && (age || opt.age) > dup.now - it.was) {
						return;
					}
					delete s[id];
				},
				0,
				99,
			);
		};
		return dup;
	};
	__usable_environment.exports.gun.dup = __usable_module.exports;
	return __usable_module.exports;
}
