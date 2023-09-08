import gunPlugin from "../gun.js";
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

	/* BEGIN WRAPPED GUN CODE */

	(() => {
		function Store(opt) {
			opt = opt || {};
			opt.file = String(opt.file || "radata");
			var store = () => {};
			var ls = __usable_globalThis.localStorage;
			store.put = (key, data, cb) => {
				ls["" + key] = data;
				cb(null, 1);
			};
			store.get = (key, cb) => {
				cb(null, ls["" + key]);
			};
			return store;
		}
		if (typeof __usable_window !== "undefined") {
			(Store.window = __usable_window.window).RlocalStorage = Store;
		} else {
			try {
				__usable_module.exports = Store;
			} catch (e) {}
		}
		try {
			var Gun = Store.window.Gun || gunPlugin(__usable_environment);
			Gun.on("create", function (root) {
				this.to.next(root);
				root.opt.store = root.opt.store || Store(root.opt);
			});
		} catch (e) {}
	})();
	__usable_environment.exports.lib.rls = __usable_module.exports;
	return __usable_module.exports;
}
