import indexPlugin from "./index.js";
import meshPlugin from "./mesh.js";
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
	//TODO: implement require and dirname

	/* BEGIN WRAPPED GUN CODE */

	var Gun = indexPlugin(__usable_environment);
	Gun.Mesh = meshPlugin(__usable_environment);

	// TODO: resync upon reconnect online/offline
	//window.ononline = window.onoffline = function(){ console.log('online?', navigator.onLine) }

	Gun.on("opt", function (root) {
		this.to.next(root);
		if (root.once) {
			return;
		}
		var opt = root.opt;
		if (false === opt.WebSocket) {
			return;
		}
		var env = Gun.window || {};
		var websocket =
			opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
		if (!websocket) {
			return;
		}
		opt.WebSocket = websocket;
		var mesh = (opt.mesh = opt.mesh || Gun.Mesh(root));
		mesh.wire || opt.wire;
		mesh.wire = opt.wire = open;
		function open(peer) {
			try {
				if (!peer || !peer.url) {
					return wire && wire(peer);
				}
				var url = peer.url.replace(/^http/, "ws");
				var wire = (peer.wire = new opt.WebSocket(url));
				wire.onclose = () => {
					reconnect(peer);
					opt.mesh.bye(peer);
				};
				wire.onerror = () => {
					reconnect(peer);
				};
				wire.onopen = () => {
					opt.mesh.hi(peer);
				};
				wire.onmessage = (msg) => {
					if (!msg) {
						return;
					}
					opt.mesh.hear(msg.data || msg, peer);
				};
				return wire;
			} catch (e) {
				opt.mesh.bye(peer);
			}
		}
		setTimeout(() => {
			!opt.super &&
				root.on("out", {
					dam: "hi",
				});
		}, 1); // it can take a while to open a socket, so maybe no longer lazy load for perf reasons?

		var wait = 2 * 999;
		function reconnect(peer) {
			clearTimeout(peer.defer);
			if (!opt.peers[peer.url]) {
				return;
			}
			if (doc && peer.retry <= 0) {
				return;
			}
			peer.retry =
				(peer.retry || opt.retry + 1 || 60) -
				(-peer.tried + (peer.tried = +new Date()) < wait * 4 ? 1 : 0);
			peer.defer = setTimeout(function to() {
				if (doc && doc.hidden) {
					return setTimeout(to, wait);
				}
				open(peer);
			}, wait);
		}
		var doc =
			"undefined" !== typeof __usable_window.document &&
			__usable_window.document;
	});
}
