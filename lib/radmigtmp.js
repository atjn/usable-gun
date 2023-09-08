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
	//TODO: implement require and dirname
	/* BEGIN WRAPPED GUN CODE */
	__usable_module.exports = (r) => {
		var Radix = radixPlugin(__usable_environment);
		r.find("a", () => {
			var l = [];
			Radix.map(r.list, (v, f) => {
				if (!(f.indexOf("%1B") + 1)) {
					return;
				}
				if (!v) {
					return;
				}
				l.push([f, v]);
			});
			if (l.length) {
				__usable_globalThis.debug.log(
					"\n! ! ! WARNING ! ! !\nRAD v0.2020.x has detected OLD v0.2019.x data & automatically migrating. Automatic migration will be turned OFF in future versions! If you are just developing/testing, we recommend you reset your data. Please contact us if you have any concerns.\nThis message should only log once.",
				);
			}
			var f;
			var v;
			l.forEach((a) => {
				f = a[0];
				v = a[1];
				r.list(decodeURIComponent(f), v);
				r.list(f, 0);
			});
			if (!f) {
				return;
			}
			r.find.bad(f);
		});
	};
	__usable_environment.exports.lib.radmigtmp = __usable_module.exports;
	return __usable_module.exports;
}
