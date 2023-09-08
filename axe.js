import mathRandomPlugin from "./usableLib/mathRandomPlugin.js";
import gunPlugin from "./gun.js";
import libAxePlugin from "./lib/axe.js";
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
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */
	mathRandomPlugin(__usable_environment);
	(() => {
		if (typeof __usable_window !== "undefined") {
			__usable_globalThis.settimeoutWindow = __usable_window;
		}
		var AXE = (__usable_globalThis.settimeoutWindow || "").AXE || (() => {});
		if ((AXE.window = __usable_globalThis.settimeoutWindow)) {
			AXE.window.AXE = AXE;
		}
		var Gun = (AXE.window || "").GUN || gunPlugin(__usable_environment);
		(Gun.AXE = AXE).GUN = AXE.Gun = Gun;

		//if(!Gun.window){ try{ require('./lib/axe') }catch(e){} }
		if (!Gun.window) {
			libAxePlugin(__usable_environment);
		}
		Gun.on("opt", function (at) {
			start(at);
			this.to.next(at);
		}); // make sure to call the "next" middleware adapter.

		function start(root) {
			if (root.axe) {
				return;
			}
			var opt = root.opt;
			var peers = opt.peers;
			if (false === opt.axe) {
				return;
			}
			if (!Gun.window) {
				return;
			} // handled by ^ lib/axe.js
			var w = Gun.window;
			var lS = w.localStorage || opt.localStorage || {};
			var loc = w.location || opt.location || {};
			var nav = w.navigator || opt.navigator || {};
			var axe = (root.axe = {});
			var tmp;
			var id;
			var mesh = (opt.mesh = opt.mesh || Gun.Mesh(root)); // DAM!

			tmp = peers[(id = loc.origin + "/gun")] = peers[id] || {};
			tmp.id = tmp.url = id;
			tmp.retry = tmp.retry || 0;
			tmp = peers[(id = "http://localhost:8765/gun")] = peers[id] || {};
			tmp.id = tmp.url = id;
			tmp.retry = tmp.retry || 0;
			Gun.log.once(
				"AXE",
				"AXE enabled: Trying to find network via (1) local peer (2) last used peers (3) a URL parameter, and last (4) hard coded peers.",
			);
			Gun.log.once(
				"AXEWarn",
				"Warning: AXE is in alpha, use only for testing!",
			);
			var last = lS.peers || "";
			if (last) {
				last += " ";
			}
			last += ((loc.search || "").split("peers=")[1] || "").split("&")[0];
			root.on("bye", function (peer) {
				this.to.next(peer);
				if (!peer.url) {
					return;
				} // ignore WebRTC disconnects for now.
				if (!nav.onLine) {
					peer.retry = 1;
				}
				if (peer.retry) {
					return;
				}
				if (axe.fall) {
					delete axe.fall[peer.url || peer.id];
				}
				(function next() {
					if (!axe.fall) {
						setTimeout(next, 9);
						return;
					} // not found yet
					var fall = Object.keys(axe.fall || "");
					var one = fall[(__usable_globalThis.mathRandom() * fall.length) >> 0];
					if (!fall.length) {
						lS.peers = "";
						one = "https://gunjs.herokuapp.com/gun";
					} // out of peers
					if (peers[one]) {
						next();
						return;
					} // already choose
					mesh.hi(one);
				})();
			});
			root.on("hi", function (peer) {
				// TEMPORARY! Try to connect all peers.
				this.to.next(peer);
				if (!peer.url) {
				} // ignore WebRTC disconnects for now.
				// DO NOT COMMIT THIS FEATURE YET! KEEP TESTING NETWORK PERFORMANCE FIRST!
			});

			function found(text) {
				axe.fall = {};
				(
					(text || "").match(
						/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
					) || []
				).forEach((url) => {
					axe.fall[url] = {
						url,
						id: url,
						retry: 0,
					}; // RETRY
				});

				// TODO: Finish porting below? Maybe not.

				var mesh = (opt.mesh = opt.mesh || Gun.Mesh(root)); // DAM!
			}

			if (last) {
				found(last);
				return;
			}
			try {
				__usable_globalThis
					.fetch(
						((loc.search || "").split("axe=")[1] || "").split("&")[0] ||
							loc.axe ||
							"https://raw.githubusercontent.com/wiki/amark/gun/volunteer.dht.md",
					)
					.then((res) => res.text())
					.then((text) => {
						found((lS.peers = text));
					})
					.catch(() => {
						found(); // nothing
					});
			} catch (e) {
				found();
			}
		}
		try {
			__usable_module.exports = AXE;
		} catch (e) {}
	})();
	__usable_environment.exports.default.axe = __usable_module.exports;
	return __usable_module.exports;
}
