import gunPlugin from "./gun.js";
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
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */
	(() => {
		var Gun =
			typeof __usable_window !== "undefined"
				? __usable_window.Gun
				: gunPlugin(__usable_environment);
		var dam = "nts";
		var smooth = 2;
		Gun.on("create", function (root) {
			// switch to DAM, deprecated old
			Gun.log.once("nts", "gun/nts is removed deprecated old");
			this.to.next(root);

			// stub out for now. TODO: IMPORTANT! re-add back in later.
			var opt = root.opt;

			var mesh = opt.mesh;
			// Track connections
			var connections = [];
			function response(msg, connection) {
				var now = Date.now(); // Lack of drift intentional, provides more accurate RTT
				connection.latency = (now - msg.nts[0]) / 2;
				connection.offset =
					msg.nts[1] + connection.latency - (now + Gun.state.drift);
				__usable_globalThis.debug.log(connection.offset);
				Gun.state.drift += connection.offset / (connections.length + smooth);
				__usable_globalThis.debug.log(
					`Update time by local: ${connection.offset} / ${
						connections.length + smooth
					}`,
				);
			}

			// Handle echo & setting based on known connection latency as well

			// Handle ping transmission
		});
	})();
}
