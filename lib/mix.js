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

	(() => {
		var Gun =
			typeof __usable_window !== "undefined"
				? __usable_window.Gun
				: gunPlugin(__usable_environment);
		Gun.state.node = (node, vertex, opt) => {
			opt = opt || {};
			opt.state = opt.state || Gun.state();
			var now = Gun.obj.copy(vertex);
			Gun.node.is(node, (val, key) => {
				var ham = Gun.HAM(
					opt.state,
					Gun.state.is(node, key),
					Gun.state.is(vertex, key),
					val,
					vertex[key],
				);
				if (!ham.incoming) {
					// if(ham.defer){}
					return;
				}
				now = Gun.state.to(node, key, now);
			});
			return now;
		};
	})();
}
