import gunPlugin from "../gun.js";
let __usable_isActivated = false;
export default function (__usable_environment) {
	if (__usable_isActivated) return;
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

	/* BEGIN WRAPPED GUN CODE */

	var Gun =
		typeof __usable_window !== "undefined"
			? __usable_window.Gun
			: gunPlugin(__usable_environment);
	Gun.on("opt", function (root) {
		this.to.next(root);
		if (root.once) {
			return;
		}
		root.on("put", function (msg) {
			Gun.graph.is(msg.put, null, (val, key, node, soul) => {
				if (null !== val) {
					return;
				}
				// TODO: Refactor this to use `.off()`?
				var tmp = root.graph[soul];
				if (tmp) {
					delete tmp[key];
				}
				tmp = tmp && tmp._ && tmp._[">"];
				if (tmp) {
					delete tmp[key];
				}
				tmp = root.next;
				if (tmp && (tmp = tmp[soul]) && (tmp = tmp.put)) {
					delete tmp[key];
					tmp = tmp._ && tmp._[">"];
					if (tmp) {
						delete tmp[key];
					}
				}
			});
			this.to.next(msg);
		});
	});
}
